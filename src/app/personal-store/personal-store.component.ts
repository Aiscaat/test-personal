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
   public userId: number;
   public oldManagerId: string;
   public newManagerId: string = null;
   public newManager: User = null;

   public managers: User[] = [];

   public file: any = null;

   constructor(private userService: UserService) { }

   getUsers() {
      return this.userService.getUsers();
   }

   getManagers() {
      this.managers = this.userService.getUsers()
         .filter(m => m.role[0] == "manager");
      return this.managers;
   }

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

   managerChangeFunc(id?: number) {
      if (id) {
         this.userId = id;
         this.oldManagerId = this.getUsers().find(u => u.id == id).manager_dependence[0];
      }
      else if (this.newManagerId !== "" && this.newManagerId !== this.oldManagerId) {
         this.newManager = this.managers.find(m => m.id == parseInt(this.newManagerId));
         this.userService.managerChange(this.newManager, this.userId, parseInt(this.oldManagerId));
      }

      this.managerConnect = !this.managerConnect;
      this.newManagerId = null;
   }

   delete(id: number) {
      this.userService.deleteUser(id);
   }

   sort(type: string) {
      return this.userService.sort(type);
   }

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
               manager_dependence: null,
               dependentList: null,
               description: null
            };

         Object.keys(newUser).forEach((_key, index) => {
            text[index] = text[index].replace('\r', ''); // only for .txt file

            if (text[index] == "-") delete newUser[_key];
            else newUser[_key] = text[index];
         })

         this.userService.addNewUser(newUser);
      }
      fileReader.readAsText(this.file);
   }

   workXML() {
      this.userService.getXmlFile();
   }
}
