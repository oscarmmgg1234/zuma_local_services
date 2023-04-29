const express = require('express')
const  server = express()
const env_data = require("./env.json")
const https = require("https");
const path = require("path")
const fs = require("fs");
const {request} = require("./models/models_interface/request_interface")
const {employee} = require("./workers/employee_interface/employee_interface")
var bodyParser = require('body-parser')

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
};

const sslServer = https.createServer(sslOptions, server);
const request_model = new request();
const Employee = new employee();
server.timeout = env_data.server_timeout
bodyParser.urlencoded({extended: false});
server.use(bodyParser.json());

//middleware
server.use('/EmployeeResourcesAPI/Generate_Time_sheet', (req,res,next)=>{
  request_model.pdf_r_model(req.body, (data)=>{req.request_model = data})
  if(req.request_model.validate()){
    next();
  }
  else
  res.send("request invalid").end();
})
server.use('/EmployeeResourcesAPI/Generate_Time_sheet_all', (req,res,next)=>{
  request_model.pdf_r_model(req.body, (data)=>{req.request_model = data})
  if(req.request_model.validate_multiple()){
    next();
  }
  else
  res.send("request invalid").end();
})
server.use('/EmployeeResourcesAPI/GPETS', (req,res,next)=>{
  req.request_model = request_model.e_r_model(req.body);
  if(req.request_model.validate()){
    next();
  }
  else
  res.send("request invalid").end();
})


//methods
 server.post('/EmployeeResourcesAPI/Zuma_Employees', async (req,res)=>{
  res.send(await get_zuma_employees());
})

 server.post('/EmployeeResourcesAPI/GPETS',async (req,res) => {
  await Employee.e_json_data(req.request_model,(data)=>res.send(data));
})

 
 server.post('/EmployeeResourcesAPI/Generate_Time_sheet', async (req, res)=>{
  await Employee.gen_pdf(req.request_model, "./generatedOutput/output.pdf");
  setTimeout(()=>{var data =fs.readFileSync('./generatedOutput/output.pdf');
  res.contentType("application/pdf");
  res.send(data);}, 3000)
})

server.post('/EmployeeResourcesAPI/Generate_Time_sheet_all', async (req, res)=>{
  await Employee.gen_pdf_all(req.request_model);
  setTimeout(()=>{var data =fs.readFileSync('./generatedOutput/merged.pdf');
  res.contentType("application/pdf");
  res.send(data);}, 4100)
})

 server.post('/EmployeeResourcesAPI/StartShift',(req,res)=>{
  Employee.e_i_s_shift([req.body.employee_id, req.body.start_time, req.body.entry_date])
  res.send("okay")
})

 server.post('/EmployeeResourcesAPI/EndShift',(req,res)=>{
  Employee.e_i_e_shift([req.body.employee_id, req.body.end_time, req.body.entry_date])
  res.send("okay")
})





//poll
sslServer.listen(env_data.server_port, () => {
    console.log(`Example  server listening on port ${env_data.server_port}`)
})
