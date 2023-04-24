const {pdfRequestModel_Wrapper, employeeRequestModel_Wrapper}
 = require('../models_wrapper/request_model_wrapper')

class request{
    pdf_r_model(args, callback){
        pdfRequestModel_Wrapper(args, (data)=>{return callback(data)})
    }
    e_r_model(args){
        return employeeRequestModel_Wrapper(args);
    }
}

exports.request = request;