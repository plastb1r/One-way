import {TokenStorageService} from '../_services/token-storage.service';
 import {HttpClient} from '@angular/common/http';
 import {Observable} from 'rxjs';
 import {Way} from '../domens/way';
import { Injectable } from '@angular/core';

 @Injectable()
 export class RoutesService {
   private routeUrl: string;
   currentUser: any;
   constructor(
     private http: HttpClient,
     private token: TokenStorageService
   ) {
     this.currentUser = this.token.getUser();
     this.routeUrl =  'http://localhost:8181/api/auth/routes';
   }
   getById(id): Observable<Way> {
     return this.http.get<Way>(this.routeUrl + '/' + id);
   }

   addWay(way: Way) {
     return this.http.put<Way>(this.routeUrl, way);
   }

   deleteById(id: number) {
     return this.http.delete(this.routeUrl + '/' + id);
   }

   getAll(): Observable<Way[]> {
     return this.http.get<Way[]>(this.routeUrl);
   }
 }