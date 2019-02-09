const mysql = require('mysql');

const connect = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'secretpassword',
   database: 'test-DB-1'
});

module.exports = connect;