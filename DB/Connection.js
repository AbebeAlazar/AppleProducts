require("dotenv").config();
let mysql = require("mysql2");
let mysqlconnection = mysql.createConnection({
    host: "localhost",
    user: "myDBuser",
    password: "085213@a",
    database: "myDB",
    multipleStatements: true
})
mysqlconnection.connect((err)=>{
    if(!err){
        console.log("the DB is connected");
    } else{
        console.log("connection failed /n err:"+ JSON.stringify(err, undefined,2)); 
        process.exit(1);
    }
})
module.exports= mysqlconnection;

