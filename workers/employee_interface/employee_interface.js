const {generate_pdf, get_json_employee_data, get_zuma_employees, insert_start_shift, insert_end_shift} 
= require('../employee_api_wrapper')

class employee {
    async gen_pdf(args){
        generate_pdf(args);
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
}

exports.employee = employee;