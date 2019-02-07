import { Injectable } from "@angular/core";
import { User } from '../model/user.model';
import { HttpService } from './http.service';



@Injectable()
export class UserService {
   private users;

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

   editUserRole(user) {
      return this.httpService.editUserRole(user.id, user.role).subscribe(u => {
         this.users.splice(this.users.findIndex(i => i.id == user.id), 1, user);
      })
   }

   sort(type) {
      this.httpService.sort(type).subscribe(data => {
         this.users = data;
      })
      
      return this.users;
   }
}