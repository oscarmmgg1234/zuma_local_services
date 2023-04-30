const {pdfRequestModel_Wrapper, employeeRequestModel_Wrapper, previewShift_Wrapper, removeShift_Wrapper}
 = require('../models_wrapper/request_model_wrapper')

class request{
    pdf_r_model(args, callback){
        pdfRequestModel_Wrapper(args, (data)=>{return callback(data)})
    }
    e_r_model(args){
        return employeeRequestModel_Wrapper(args);
    }
    preview_s(args,callback){
        return callback(previewShift_Wrapper(args))
    }
    remove_s(args,callback){
        return callback(removeShift_Wrapper(args));
    }
}

exports.request = request;