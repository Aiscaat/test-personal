const fs = require('fs');
const xml2js = require('xml2js');

const consts = require("./../const.config")

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

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

exports.addNewUser = (req, res) => {
   readFile((result) => {
      let users = result.personal.user,
         id = users.length + 1,
         newObject = Object.assign({ id: id }, req.body);

      users.push(newObject);

      rewriteFile(result);
      res.json(users);
   });
}

exports.changeManager = (req, res) => {
   if (req.body.oldManagerId === req.params.id) res.end();

   let
      oldManagerId = req.body.oldManagerId,
      newManagerId = req.params.id,
      dependentId = req.body.dependentId[0];

   let actions = { addId: false, removeId: false }

   let responseResult = {};

   readFile((result) => {
      let currElId;

      for (let el of result.personal.user) {
         currElId = parseInt(el.id[0]);

         // find current user (for return on client)
         if (currElId == dependentId) {
            el.manager_dependence[0] = newManagerId;
            responseResult['user'] = el;
         }

         // find old manager and delete from his dependentList current user
         if (currElId == oldManagerId) {
            let dependentArr = el.dependentList[0].split(',');
            dependentArr.splice(dependentArr.findIndex(i => i == dependentId), 1);
            el.dependentList[0] = dependentArr.join(",");

            responseResult['oldManager'] = el;

            if (actions.addId) break;
         }

         // find new manager and add to his dependentList current user
         if (currElId == newManagerId) {
            el.dependentList[0] += `,${dependentId}`;

            responseResult['newManager'] = el;

            if (actions.removeId) break;
         }
      }

      rewriteFile(result);
      res.json(responseResult);
   })
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

exports.getXmlFile = (req, res) => res.sendFile(consts.PERSONAL_XML_FILE_URL);


// next 3 func more better U in 1 module sort
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
   fs.readFile(consts.PERSONAL_XML_FILE_URL, 'utf-8', (err, data) => {
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