var personalCtrls = require('../controller/personal.controller');

module.exports = (app) => {

   // get all personal
   app.get('/users', personalCtrls.getAllPersonal);

   // delete user
   app.delete('/users/:id', personalCtrls.deleteUser);

   // change user role
   app.put('/users/:id', personalCtrls.changeUserRole);

   // sort users
   app.get('/users/sort/:type', personalCtrls.sort);

   // add new user
   app.post('/users/addUser', personalCtrls.addNewUser);

   // change manager for user
   app.put('/users/changeManager/:id', personalCtrls.changeManager);

   // get person xml file
   app.get('/xml/get/person', personalCtrls.getXmlFile)
}