// const populate_db = () => {
//   const query = 'INSERT INTO SHIFT_LOG(EMPLOYEE_ID,SHIFT_START,SHIFT_END,SHIFT_DATE) VALUES (?,?,?,?)'
//   var date_entry = new Date(2023,2,1);
//   var shift_start_entry = new Date("2023-03-01T08:00:00");
//   var shift_end_entry = new Date("2023-03-01T15:30:00");
//     const pattern = date.compile('YYYY-MM-DD');
//   const map = ['001223','003422','002334','006755','003222','001111']
//   map.forEach((value)=>{
//     var date_entry = new Date(2023,2,1);
//     var shift_start_entry = new Date("2023-03-01T08:00:00");
//     var shift_end_entry = new Date("2023-03-01T15:30:00");
//     for(var i = 0; i < 11;i++){
  
//     connection.query(query,[value,shift_start_entry, shift_end_entry, date.format(date_entry, pattern)],(err,result)=>{
      
//     })
//     if(i == 2 || i == 7){
//       date_entry = date.addDays(date_entry, 3)
//     }
//     else{
//     date_entry = date.addDays(date_entry, 1)
//     }
//     shift_start_entry = date.addDays(shift_start_entry,1);
//     shift_end_entry = date.addDays(shift_end_entry,1)
//   }})
  
  
//   }
//   populate_db();