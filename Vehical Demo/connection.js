let mysql=require('mysql');
let con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"pratik@123",
    database:"nodedemo"
})
let util=require('util');
let exe=util.promisify(con.query).bind(con);
module.exports=exe;