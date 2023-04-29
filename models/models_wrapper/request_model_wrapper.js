const {pdfRequestModel} = require("../request_model/pdf_request_model");
const {employeeRequestModel} = require('../request_model/employee_data_request_model');
const {employeeShiftStartRequestModel} = require('../request_model/employee_shift_start_request_model')
const {PreviewRequestModel} = require('../request_model/preview_request_model')

const pdf_request_model = (args, callback) => {
    return callback(pdfRequestModel(args));
}

const employee_data_request_model = (args) => {
    return employeeRequestModel(args);
}

const employee_shift_start_request_model = (args) => {
    return employeeShiftStartRequestModel(args);
}

const preview_shift = (args) => {
    return PreviewRequestModel(args);
}







exports.pdfRequestModel_Wrapper = pdf_request_model;
exports.employeeRequestModel_Wrapper = employee_data_request_model;
exports.employeeShiftStartRequestModel_Wrapper = employee_shift_start_request_model;
exports.previewShift_Wrapper = preview_shift;