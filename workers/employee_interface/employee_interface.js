const {generate_pdf, get_json_employee_data, get_zuma_employees, insert_start_shift, insert_end_shift, generate_pdf_all, previewEndShift, previewStartShift,
transformEndShift, transformStartShift, removeShift} 
= require('../employee_api_wrapper')

class employee {
    async gen_pdf(args,path){
        generate_pdf(args,path);
    }
    async gen_pdf_all(args){
        generate_pdf_all(args);
    }
    e_json_data(args,callback){
        return callback(get_json_employee_data(args));
    }
    g_z_employees(callback){
        return callback(get_zuma_employees());
    }
    e_i_s_shift(args){
        insert_start_shift(args);
    }
    e_i_e_shift(args){
        insert_end_shift(args);
    }
    async prev_e_s(args,callback){
        return callback(await previewEndShift(args))
    }
    async prev_s_s(args, callback){
        return callback(await previewStartShift(args))
    }

    trans_e_s(args){
        transformEndShift(args);
    }

    trans_s_s(args){
        transformStartShift(args);
    }

    rm_shift(args){
        removeShift(args);
    }
}

exports.employee = employee;