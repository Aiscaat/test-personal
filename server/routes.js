module.exports = (app) => {
   var personalCtrls = require('./controller/personal.controller');

   // get all personal
   app.get('/users', personalCtrls.getAllPersonal);

   // delete user
   app.delete('/users/:id', personalCtrls.deleteUser);

   // change user role
   app.put('/users/:id', personalCtrls.changeUserRole);

   // sort users
   app.get('/users/sort/:type', personalCtrls.sort);

   // add new user
   // app.post('/users/addUser', personalCtrls.addNewUser);
}