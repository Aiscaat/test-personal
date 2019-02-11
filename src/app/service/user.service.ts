import { Injectable } from "@angular/core";
import { User } from '../model/user.model';
import { HttpService } from './http.service';
import { saveAs } from "file-saver";
// import 'rxjs/Rx';


@Injectable()
export class UserService {
   private users: User[] = [];

   constructor(private httpService: HttpService) {
      this.httpService.getUsers().subscribe(data => {
         this.users = data;
      })
   }

   getUsers(): User[] {
      return this.users;
   }

   deleteUser(id: number) {
      this.httpService.deleteUser(id).subscribe(u => {
         this.users.splice(this.users.findIndex(i => i.id == id), 1);
      })
   }

   editUserRole(user: User) {
      return this.httpService.editUserRole(user.id, user.role).subscribe(u => {
         this.users.splice(this.users.findIndex(i => i.id == user.id), 1, user);
      })
   }

   sort(type: string) {
      this.httpService.sort(type).subscribe(data => {
         this.users = data;
      })

      return this.users;
   }

   addNewUser(user: User) {
      this.httpService.addNewUser(user).subscribe(data => {
         this.users = data;
      })
   }

   managerChange(manager: User, userId: number, oldManagerId: number) {
      this.httpService.managerChange(manager.id, userId, oldManagerId).subscribe(data => {
         this.users.splice(this.users.findIndex(i => i.id == data['newManager'].id[0]), 1, data['newManager']);
         this.users.splice(this.users.findIndex(i => i.id == data['oldManager'].id[0]), 1, data['oldManager']);
         this.users.splice(this.users.findIndex(i => i.id == data['user'].id[0]), 1, data['user']);
      })
   }

   getXmlFile() {
      this.httpService.getXmlFile().subscribe(data => this.downloadFile(data));
   }

   private downloadFile(data: any) {
      let blob = new Blob([data.body], { type: 'text/xml' }),
         fileName = 'personal';
      saveAs(blob, fileName);
   }
}