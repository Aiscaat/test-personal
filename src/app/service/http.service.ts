import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

const PROTOCOL = 'http';
const PORT = 3200;

@Injectable()
export class HttpService {
   baseUrl: string;

   constructor(private http: HttpClient) {
      this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
   }

   getUsers(): Observable<User[]> {
      return this.http.get<User[]>(`${this.baseUrl}users`)
   }

   deleteUser(id: number): Observable<User> {
      return this.http.delete<User>(`${this.baseUrl}users/${id}`);
   }

   editUserRole(id: number, role: string): Observable<User> {
      return this.http.put<User>(`${this.baseUrl}users/${id}`, { role: role });
   }

   sort(type): Observable<User[]> {
      return this.http.get<User[]>(`${this.baseUrl}users/sort/${type}`);
   }

   addNewUser(user: User): Observable<User[]> {
      return this.http.post<User[]>(`${this.baseUrl}users/addUser`, user);
   }

   managerChange(id: number, dependentId: number, oldManagerId: number): Observable<Object> {
      return this.http.put<Object>(`${this.baseUrl}users/changeManager/${id}`, { dependentId, oldManagerId });
   }

   getXmlFile() {
      return this.http.get(`${this.baseUrl}xml/get/person`, { observe: 'response', responseType: 'blob' });
   }
}
