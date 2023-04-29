const {db_init} = require('./db_init')
const date = require('date-and-time')
const fs = require('fs')
var pdf = require("pdf-creator-node");
const { PDFDocument, StandardFonts } = require('pdf-lib');

const { request } = require('../models/models_interface/request_interface');

const req = new request()

var html = fs.readFileSync("./html_templates/time_sheet.html", "utf8");

const db = db_init();
db.connect();

const querys = {
get_all_time_sheet: "SELECT EMPLOYEE_ID, COUNT(*) OVER() AS count FROM EMPLOYEE",
get_employees: "SELECT * FROM EMPLOYEE", 
get_count_shift_entry: "SELECT COUNT(*) AS entryCount FROM SHIFT_LOG WHERE EMPLOYEE_ID = ? AND SHIFT_DATE = ?",
insert_shift_employee: "INSERT INTO SHIFT_LOG(EMPLOYEE_ID,SHIFT_START,SHIFT_DATE) VALUES (?,?,?)",
insert_shift_end_employee: "UPDATE SHIFT_LOG SET SHIFT_END = ? WHERE EMPLOYEE_ID = ? AND SHIFT_DATE = ?",
get_specific_employee_info: "SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID = ?",
get_shift_log: "SELECT * FROM SHIFT_LOG WHERE SHIFT_DATE >= ? AND SHIFT_DATE <= ? AND EMPLOYEE_ID = ?",
remove_shift_log: "DELETE FROM SHIFT_LOG WHERE EMPLOYEE_ID = ? AND SHIFT_DATE = ?",
transform_start_shift_log: "UPDATE SHIFT_LOG SET SHIFT_START = ? WHERE EMPLOYEE_ID = ?",
transform_end_shift_log: "UPDATE SHIFT_LOG SET SHIFT_END = ? WHERE EMPLOYEE_ID = ?",

}

const insertStartShiftTimeSlot = (args) => {
  //check if entry exist
  db.query(querys.get_count_shift_entry,[args[0],args[2]],(err,result,fields)=>{
    if(err) return err;
    var data = Object.values(JSON.parse(JSON.stringify(result)))
    if(data[0].entryCount == 0){
      db.query(querys.insert_shift_employee,args,(err,result)=>{
        
      })
    }
  })
}

const insertEndShiftTimeSlot = (args) => {
      db.query(querys.insert_shift_end_employee,[args[1],args[0],args[2]],(err,result)=>{
      })
}

const getEmployeeInfo = (args) => {
  return new Promise((resolve)=>{
    db.query(querys.get_specific_employee_info, [args], (err,result,fields)=>{
      if(err) resolve(err)
      resolve(Object.values(JSON.parse(JSON.stringify(result))))
    })
  })
}

const getEmployee_formatted = (args) => {
  return new Promise((resolve)=>{
    var othours = 0;
    var hours = 0;
    var date1;
    var date2;
    var date3;
    var output;
    const date_pattern = date.compile('MMM DD YYYY');
    const date_pattern_shift = date.compile('hh:mm A');
    db.query(querys.get_shift_log,args.map(),function (err, result, fields) {
        
        output = Object.values(JSON.parse(JSON.stringify(result))).map((val,index)=>{
        const fullTime = 40;
        date1 = new Date(val.SHIFT_START)
        date2 = new Date(val.SHIFT_END)
        date3 = new Date(val.SHIFT_DATE);
        hours =  Math.floor(date.subtract(date2,date1).toHours());
        if(hours > 40){
          othours = hours - 40;
        }
        return {...val,SHIFT_START: date.format(date1,date_pattern_shift), SHIFT_END: date.format(date2,date_pattern_shift),SHIFT_HOURS: hours > 40 ? fullTime.toFixed(2) : hours.toFixed(2),
        SHIFT_OTHOURS: othours.toFixed(2),SHIFT_DATE: date.format(date3, date_pattern)}
      })
      resolve(output)
    });
  })
}


const GeneratePDF = (args,path) => {
  return new Promise(async (Resolve)=>{
      
      var data = await getEmployee_formatted(args);
      var employee_data = await getEmployeeInfo(args.e_id);
      var Days = 0;
      var TotalHours = 0;
      var TotalOTHours = 0;
      data.forEach((val)=>{TotalHours += parseFloat(val.SHIFT_HOURS); TotalOTHours += parseFloat(val.SHIFT_OTHOURS); Days = Days + 1;})
      const pattern = date.compile('MMM DD YYYY')
      const date1 = date.addDays(new Date(args.range_start),1);
      const date2 = date.addDays(new Date(args.range_end),1);

      employee_data[0].SHIFT_START = date.format(date1, pattern)
      employee_data[0].SHIFT_END = date.format(date2, pattern)
      employee_data[0].SHIFT_HOURS = TotalHours;
      employee_data[0].SHIFT_OTHOURS = TotalOTHours;
      employee_data[0].NAME = employee_data[0].NAME.toUpperCase();
      employee_data[0].SHIFT_DAYS = Days;
      
      var document = {
        data: {employeeData: data, employee: employee_data[0]},
        html: html,
        path: path,
        type: "",
      };
        var options = {
        format: "Letter",
        orientation: "portrait",
        border: "5mm"
      };
        pdf
      .create(document, options)
      .then((res) => {
      })
      .catch((error) => {
        console.error(error);
      });
      
      Resolve();
      })}


const generate_all_time_sheets = async (args) =>{
  var file_counter = 1;
  var files = [];
  files.push("./generatedOutput/output0.pdf")
  db.query(querys.get_all_time_sheet,(err,result)=>{
    if(err)console.log(err);
    const res = Object.values(JSON.parse(JSON.stringify(result)));
    req.pdf_r_model({shift_start_range: args.range_start, shift_end_range: args.range_end,employee_id: res[0].EMPLOYEE_ID},(data)=>{GeneratePDF(data,'./generatedOutput/output0.pdf');})
      const intervalID = setInterval(()=>{
        if(file_counter == res[0].count){
          
          clearInterval(intervalID)
      
        }
        else{
      var path = `./generatedOutput/output${file_counter}.pdf`;
      files.push(path);
      req.pdf_r_model({shift_start_range: args.range_start, shift_end_range: args.range_end,employee_id: res[file_counter].EMPLOYEE_ID},(data)=>{GeneratePDF(data,path);})
      file_counter = file_counter + 1;
        }
      
  }, 600)
  setTimeout(()=>{merge_pdf(files)}, res[0].count*600)
  })}

  const merge_pdf = async (files)=>{
    const mergedPdf = await PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
      const fileContents = fs.readFileSync(files[i]);
      const pdf = await PDFDocument.load(fileContents);
    
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync('./generatedOutput/merged.pdf', mergedPdfBytes);
  }


const getEmployees = () => {
  return new Promise((resolve)=>{
  db.query(querys.get_employees,(err,result)=>{
   resolve(Object.values(JSON.parse(JSON.stringify(result))))
  });
})}

const previewTransformEndShift = (args) =>{

  return new Promise((resolve)=>{
    const date_entry_pattern = date.compile('YYYY-MM-DD');
    const output_entry_pattern = date.compile('YYYY-MM-DD HH:mm')

    const start = new Date(args.date);
    const range_start = date.addDays(start, 2);
    const range_end = start;


    db.query(querys.get_shift_log, [date.format(range_end, date_entry_pattern), date.format(range_start, date_entry_pattern), args.e_id], (err,result)=>{
      const data = Object.values(JSON.parse(JSON.stringify(result)));
      const newStart = date.addDays(start, 1);
      const date_res = data.map((dateObj)=>{

        if(date.format(new Date(dateObj.SHIFT_DATE),date_entry_pattern).toString()== date.format(newStart,date_entry_pattern).toString()){
          const newDate = date.addHours(new Date(dateObj.SHIFT_END),args.hours)
          const inpt = date.format(newDate,output_entry_pattern)
          return {SHIFT_END: inpt,SHIFT_CHANGE: true,
          SHIFT_START: date.format(new Date(dateObj.SHIFT_START), output_entry_pattern),
          SHIFT_DATE: date.format(new Date(dateObj.SHIFT_DATE), date_entry_pattern),
          };
        }
        else{
        return {SHIFT_END: date.format(new Date(dateObj.SHIFT_END),output_entry_pattern),
        SHIFT_START: date.format(new Date(dateObj.SHIFT_START), output_entry_pattern),
        SHIFT_DATE: date.format(new Date(dateObj.SHIFT_DATE), date_entry_pattern),
        };
      }
      })
      resolve(date_res)
    })
  })
}

// previewTransformEndShift({date: "2023-05-08", e_id: "00001", hours: -3})




const previewTransformStartShift = (args) =>{
 
  return new Promise((resolve)=>{
    const date_entry_pattern = date.compile('YYYY-MM-DD');
    const output_entry_pattern = date.compile('YYYY-MM-DD HH:mm')

    const start = new Date(args.date);
    const range_start = date.addDays(start, 2);
    const range_end = start;


    db.query(querys.get_shift_log, [date.format(range_end, date_entry_pattern), date.format(range_start, date_entry_pattern), args.e_id], (err,result)=>{
      const data = Object.values(JSON.parse(JSON.stringify(result)));
      const newStart = date.addDays(start, 1);
      const date_res = data.map((dateObj)=>{

        if(date.format(new Date(dateObj.SHIFT_DATE),date_entry_pattern).toString()== date.format(newStart,date_entry_pattern).toString()){
          const newDate = date.addHours(new Date(dateObj.SHIFT_START),args.hours)
          const inpt = date.format(newDate,output_entry_pattern)
          return {SHIFT_END: date.format(new Date(dateObj.SHIFT_END),output_entry_pattern),SHIFT_CHANGE: true,
          SHIFT_START: inpt,
          SHIFT_DATE: date.format(new Date(dateObj.SHIFT_DATE), date_entry_pattern),
          };
        }
        else{
        return {SHIFT_END: date.format(new Date(dateObj.SHIFT_END),output_entry_pattern),
        SHIFT_START: date.format(new Date(dateObj.SHIFT_START), output_entry_pattern),
        SHIFT_DATE: date.format(new Date(dateObj.SHIFT_DATE), date_entry_pattern),
        };
      }
      })
      resolve(date_res)
    })
  })
}

const transformEndShift = () =>{

}

const transformStartShift = () => {
  
}




exports.GeneratePDF = GeneratePDF;
exports.getEmployeeInfo = getEmployeeInfo;
exports.insertStartShiftTime = insertStartShiftTimeSlot;
exports.insertEndShiftTime = insertEndShiftTimeSlot;
exports.getZumaEmployees = getEmployees;
exports.getJsonEmployeeData = getEmployee_formatted;
exports.GeneratePDF_ALL = generate_all_time_sheets;
exports.PreviewEndTransformation = previewTransformEndShift;
exports.PreviewStartTransformation = previewTransformStartShift;