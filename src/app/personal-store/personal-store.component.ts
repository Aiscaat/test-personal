import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';

@Component({
   selector: 'app-personal-store',
   templateUrl: './personal-store.component.html',
   styleUrls: ['./personal-store.component.sass']
})
export class PersonalStoreComponent {
   public person: User = {};
   public personRole: string = '';
   public changeRole: boolean = false;

   public managerConnect: boolean = false;
   public managerSelect: User = {};
   public newManager: any = null;

   constructor(private userService: UserService) { }

   getUsers() {
      return this.userService.getUsers();
   }

   // getManagers() {
   //    return this.userService.getUsers().filter(m => {
   //       console.log(m.role[0]);
   //       m.role[0] == "manager";
   //    });
   // }

   changeRoleFunc(user?: User) {
      if (user)
         this.person = user;
      else if (this.personRole !== '') {
         this.person.role = this.personRole;
         this.userService.editUserRole(this.person);
         this.personRole = '';
      }
      this.changeRole = !this.changeRole;
   }

   // not all logic in function
   managerChangeFunc(id?: number) {
      if (id)
         this.managerSelect = this.userService.getUsers().filter(m => { m.id == id })[0];
      else if (this.newManager !== null) {

      }
      this.managerConnect = !this.managerConnect;
   }

   delete(id: number) {
      this.userService.deleteUser(id);
   }

   sort(type) {
      return this.userService.sort(type);
   }

   public file: any = null;
   fileChangeEvent(e) {
      this.file = e.target.files[0];
   }

   upload() {
      if (this.file === null) return false;

      let fileReader = new FileReader();

      fileReader.onloadend = () => {
         let text = fileReader.result.toString().split('\n'),
            newUser = {
               first_name: null,
               last_name: null,
               father_name: null,
               b_day_date: null,
               work_start_date: null,
               role: null,
               dependentList: null,
               description: null
            };

         Object.keys(newUser).forEach((_key, index) => {
            text[index] = text[index].replace('\r', ''); // only for .txt file

            if (text[index] == "-") {
               delete newUser[_key];
            }
            else newUser[_key] = text[index];
         })

         this.userService.addNewUser(newUser);

      }
      fileReader.readAsText(this.file);
   }
}
