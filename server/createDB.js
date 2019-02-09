const connect = require('./db.connect');

connect.connect((err) => {
   if (err) throw err;
   console.log('connect');
   
})