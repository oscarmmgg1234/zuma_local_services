
class pdf_request_model {
    range_start = null;
    range_end = null;
    e_id = null;
    constructor(args){
        this.range_start = args[0] ? args[0] : null;
        this.range_end = args[1] ? args[1] : null;
        this.e_id = args[2] ? args[2] : null;
    }
    validate(){
        if(this.range_start == null || this.range_end == null || this.e_id == null || this.range_start == "" || this.range_end == "" || this.e_id == "" ){
            return false;
        }
        return true;
    }
    map(){
        return [this.range_start, this.range_end, this.e_id];
    }
}
const pdfRequestModel = (args) =>{
    return new pdf_request_model([args.shift_start_range, args.shift_end_range, args.employee_id]);  
}


exports.pdfRequestModel = pdfRequestModel;