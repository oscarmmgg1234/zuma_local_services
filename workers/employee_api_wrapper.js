
const {
  GeneratePDF, getEmployeeInfo, 
  insertStartShiftTime, insertEndShiftTime, getZumaEmployees,
  getJsonEmployeeData, GeneratePDF_ALL, PreviewEndTransformation, PreviewStartTransformation,
transformEndShift, transformStartShift, removeShift, PreviewRemoveShift}
  = require("../db_api/employeeHelper");

const remove_shift = (args) => {
  removeShift(args);
}

const preview_remove_shift = async (args) => {
  return await PreviewRemoveShift(args);
}

const transform_end_shift = (args) => {
  transformEndShift(args);
}

const transform_start_shift = (args) => {
  transformStartShift(args);
}

const generate_timesheet_pdf_wrapper = async (args) => {
  return await GeneratePDF(args);
}

const generate_time_all_wrapper = async (args) =>{
  return await GeneratePDF_ALL(args);
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

const preview_end_shift = async (args) => {
  return await PreviewEndTransformation(args);
}

const preview_start_shift = async (args) => {
  return await PreviewStartTransformation(args);
}


exports.generate_pdf = generate_timesheet_pdf_wrapper;
exports.get_employee_info = get_employee_info_wrapper;
exports.insert_start_shift = insert_start_shift_wrapper;
exports.insert_end_shift = insert_end_shift_wrapper;
exports.get_zuma_employees = get_zuma_employees_wrapper;
exports.get_json_employee_data = get_json_employeeData_wrapper;
exports.generate_pdf_all = generate_time_all_wrapper;
exports.previewEndShift = preview_end_shift;
exports.previewStartShift = preview_start_shift;
exports.transformEndShift = transform_end_shift;
exports.transformStartShift = transform_start_shift;
exports.removeShift = remove_shift;
exports.previewRemoveShift = preview_remove_shift;