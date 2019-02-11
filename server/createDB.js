const consts = require('./const.config');
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

let con = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'secretpassword'
})

// create DB
con.connect((err) => {
   if (err) throw err;

   console.log('Connect to create DB');

   con.query("CREATE DATABASE test-DB-1", (err, res) => {
      if (err) throw err;
      console.log("Database created");
   });
})

con = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'secretpassword',
   database: 'test-DB-1'
})

// create table & add row to table
con.connect((err) => {
   if (err) throw err;

   console.log('Connect');

   var sqlCreateTable = 'CREATE TABLE users ('
      + 'id INT'
      + 'first_name VARCHAR(255)'
      + 'last_name VARCHAR(255)'
      + 'father_name VARCHAR(255)'
      + 'b_day_date DATE'
      + 'work_start_date DATE'
      + 'role VARCHAR(255)'
      + 'manager_dependence INT'
      + 'dependentList VARCHAR(MAX)'
      + 'description VARCHAR(MAX)'
      + ')';

   con.query(sqlCreateTable, (err, res) => {
      if (err) throw err;
      console.log("Create Table users");
   })

   // generate query and query to DB
   var result = '', resultValue = '', rowObj = {
      id: null,
      first_name: null,
      last_name: null,
      father_name: null,
      b_day_date: null,
      work_start_date: null,
      role: null,
      manager_dependence: null,
      dependentList: null,
      description: null
   };

   fs.readFile(consts.PERSONAL_XML_FILE_URL, 'utf-8', (err, data) => {
      if (err) console.error(err);

      parser.parseString(data, (err, res) => {
         if (err) console.error(err);

         // generate query
         res.personal.user.forEach(user => {
            if (user.id[0]) rowObj.id = parseInt(user.id[0]);
            else {
               result = null;
               return result;
            }

            if (user.first_name[0]) rowObj.first_name = user.first_name[0];
            if (user.last_name[0]) rowObj.last_name = user.last_name[0];
            if (user.father_name[0]) rowObj.father_name = user.father_name[0];
            if (user.b_day_date[0]) rowObj.b_day_date = Date.parse(user.b_day_date[0]);
            if (user.work_start_date[0]) rowObj.work_start_date = Date.parse(user.work_start_date[0]);
            if (user.role[0]) rowObj.role = user.role[0];
            if (user.manager_dependence[0]) rowObj.manager_dependence = parseInt(user.manager_dependence[0]);
            if (user.dependentList[0]) rowObj.dependentList = user.dependentList[0];
            if (user.description[0]) rowObj.description = user.description[0];

            var keys = Object.keys(rowObj);

            keys.forEach((key, index) => {
               if (rowObj[key] !== null) resultValue += ` '${rowObj[key]}'`;
               else resultValue += ` `;

               if (index !== keys.length - 1) resultValue += `,`;
            })

            // query
            result = `INSERT INTO users (
               id,
               first_name,
               last_name,
               father_name,
               b_day_date,
               work_start_date,
               role,
               manager_dependence,
               dependentList,
               description
            ) VALUES (${resultValue})`;


            // query to DB
            con.query(result, (err, res) => {
               if (err) throw err;

               console.log("add row to DB");
            });
         });
      })
   });

   console.log('End connect with DB');  
})