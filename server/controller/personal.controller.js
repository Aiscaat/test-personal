const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

const filePath = `${__dirname}../../personal.xml`;

exports.getAllPersonal = (req, res) => {
   readFile((result) => {
      res.json(result.personal.user);
   })
}

exports.deleteUser = (req, res) => {
   readFile((result) => {
      result.personal.user
         .splice(result.personal.user
            .findIndex(i => i.id == req.param.id), 1);

      rewriteFile(result);
   })

   res.end();
}

exports.changeUserRole = (req, res) => {
   readFile((result) => {
      for (let el of result.personal.user) {
         if (parseInt(el.id[0]) == req.params.id) {
            el.role[0] = req.body.role;
            break;
         }
      }

      rewriteFile(result);
   })

   res.end();
}

exports.sort = (req, res) => {
   let sortRes = null;

   readFile((result) => {
      switch (req.params.type) {
         case 'lName':
            sortRes = lNameSort(result);
            break;
         case 'date':
            sortRes = dateSort(result);
            break;
         case 'reset':
            sortRes = resetSort(result);
            break;
      }

      res.json(sortRes);
      sortRes = null;
   })
}

// exports.addNewUser = (req, res) => {
//    if (Object.keys(req.files).length == 0)
//       return res.status(400).send('No files were uploaded.');

//    let file = req.files["uploads[]"];

//    file.mv(`${__dirname}../../${file.name}`, function (err) {
//       if (err) return res.status(500).send(err);
//       addNewUserProces(file.name);
//    });

//    res.json();
// }

function lNameSort(result) {
   innerSort(result.personal.user, 'last_name');

   rewriteFile(result);
   return result.personal.user;
}

function dateSort(result) {
   innerSort(result.personal.user, 'work_start_date', (e) => {
      return Date.parse(e);
   })

   rewriteFile(result);
   return result.personal.user;
}

function resetSort(result) {
   innerSort(result.personal.user, 'id', (e) => {
      return parseInt(e);
   })

   rewriteFile(result);
   return result.personal.user;
}

function innerSort(arr, prop, propHandler) {
   if (!propHandler) {
      arr.sort((a, b) => {
         if (a[prop] > b[prop]) return 1;
         if (a[prop] < b[prop]) return -1;
         return 0;
      })
   }

   if (propHandler) {
      arr.sort((a, b) => {
         if (propHandler(a[prop]) > propHandler(b[prop])) return 1;
         if (propHandler(a[prop]) < propHandler(b[prop])) return -1;
         return 0;
      })
   }
}

function readFile(func) {
   fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) console.error(err);

      parser.parseString(data, (err, result) => {
         if (err) console.error(err);
         func(result);
      })
   });
}

function rewriteFile(result) {
   fs.writeFile('personal.xml', builder.buildObject(result), 'utf-8', () => { })
}

// function addNewUserProces(filename) {
//    fs.readFile(`${__dirname}../../${filename}`, 'utf-8', (err, data) => {
//       if (err) console.error(err);

//       let props = ['FIO', 'BDay', 'WorkStartDate', 'Role', 'Dependents', 'Description'];
//       let index;
//       let newUser = {};

//       props.forEach(item => {
//          index = data.findIndex(`${item}: `);
//          if (index !== -1) {
//             switch (item) {
//                case 'FIO':
//                   _addNewUserSwitch('first_name');
//                   break;
            
//                default:
//                   break;
//             }
//          }
//       })

//       function _addNewUserSwitch(prop) {
//          newUser[prop]
//       }

//       console.log(data);
//    });
// }