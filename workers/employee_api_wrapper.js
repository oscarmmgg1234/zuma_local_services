
const {
  GeneratePDF, getEmployeeInfo, 
  insertStartShiftTime, insertEndShiftTime, getZumaEmployees,
  getJsonEmployeeData}
  = require("../db_api/employeeHelper");


const generate_timesheet_pdf_wrapper = async (args) => {
  GeneratePDF(args);
}

const get_employee_info_wrapper = async (args) =>{
  return await getEmployeeInfo(args);
}

const insert_start_shift_wrapper = (args) => {
  insertStartShiftTime(args);
}

const insert_end_shift_wrapper = (args) =>{
  insertEndShiftTime(args);
}

const get_zuma_employees_wrapper = async () => {
  return await getZumaEmployees();
}

const get_json_employeeData_wrapper = async (args) => {
return await getJsonEmployeeData(args);
}


exports.generate_pdf = generate_timesheet_pdf_wrapper;
exports.get_employee_info = get_employee_info_wrapper;
exports.insert_start_shift = insert_start_shift_wrapper;
exports.insert_end_shift = insert_end_shift_wrapper;
exports.get_zuma_employees = get_zuma_employees_wrapper;
exports.get_json_employee_data = get_json_employeeData_wrapper;
