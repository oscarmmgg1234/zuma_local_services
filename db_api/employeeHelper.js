const {db_init} = require('./db_init')
const date = require('date-and-time')
const fs = require('fs')
var pdf = require("pdf-creator-node");

var html = fs.readFileSync("./html_templates/time_sheet.html", "utf8");

const db = db_init();
db.connect();

const querys = {
get_employees: "SELECT EMPLOYEE_ID,NAME FROM EMPLOYEE", 
get_count_shift_entry: "SELECT COUNT(*) AS entryCount FROM SHIFT_LOG WHERE EMPLOYEE_ID = ? AND SHIFT_DATE = ?",
insert_shift_employee: "INSERT INTO SHIFT_LOG(EMPLOYEE_ID,SHIFT_START,SHIFT_DATE) VALUES (?,?,?)",
insert_shift_end_employee: "UPDATE SHIFT_LOG SET SHIFT_END = ? WHERE EMPLOYEE_ID = ? AND SHIFT_DATE = ?",
get_specific_employee_info: "SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID = ?",
get_shift_log: "SELECT * FROM SHIFT_LOG WHERE SHIFT_DATE BETWEEN ? AND ? AND EMPLOYEE_ID = ?"
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

const GeneratePDF = (args) => {
  return new Promise(async (Resolve)=>{var TotalHours = 0;
    var TotalOTHours = 0;
    current_file_path = "./output.pdf"
    var data = await getEmployee_formatted(args);
    var employee_data = await getEmployeeInfo(args.e_id);
    data.forEach((val)=>{TotalHours += parseFloat(val.SHIFT_HOURS); TotalOTHours += parseFloat(val.SHIFT_OTHOURS)})
    const pattern = date.compile('MMM DD YYYY')
    const date1 = new Date(args.shift_start);
    const date2 = new Date(args.shift_end);
    employee_data[0].SHIFT_START = date.format(date1, pattern)
    employee_data[0].SHIFT_END = date.format(date2, pattern)
    employee_data[0].SHIFT_HOURS = TotalHours;
    employee_data[0].SHIFT_OTHOURS = TotalOTHours;
    employee_data[0].NAME = employee_data[0].NAME.toUpperCase();
    
      var options = {
      format: "Letter",
      orientation: "portrait",
      border: "5mm"
    };
    var document = {
      data: {employeeData: data, employee: employee_data[0]},
      html: html,
      path: current_file_path,
      type: "",
    };
      pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });Resolve();})
  
}

const getEmployees = () => {
  return new Promise((resolve)=>{
  db.query(querys.get_employees,(err,result)=>{
   resolve(Object.values(JSON.parse(JSON.stringify(result))))
  });
})}



exports.GeneratePDF = GeneratePDF;
exports.getEmployeeInfo = getEmployeeInfo;
exports.insertStartShiftTime = insertStartShiftTimeSlot;
exports.insertEndShiftTime = insertEndShiftTimeSlot;
exports.getZumaEmployees = getEmployees;
exports.getJsonEmployeeData = getEmployee_formatted;
