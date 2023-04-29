
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
        const start_date = new Date(this.range_start)
        const end_date = new Date(this.range_end)
        if(this.range_start == null || this.range_end == null || this.e_id == null || this.range_start == "" || this.range_end == "" || this.e_id == "" || isNaN(start_date) || isNaN(end_date) ){
            return false;
        }
        return true;
    }
    validate_multiple(){
        const start_date = new Date(this.range_start)
        const end_date = new Date(this.range_end)
        if(this.range_start == null || this.range_end == null || this.range_start == "" || this.range_end == "" || isNaN(start_date) || isNaN(end_date) ){
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