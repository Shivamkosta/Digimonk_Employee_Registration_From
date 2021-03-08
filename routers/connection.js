const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'',
    database:'digimonk',
    connectionLimit:100,
    multipleStatements:true
});

connection.connect(function(err){
    if(err) throw err;
    console.log(`DB CONNECTED`)
}); 
module.exports = connection