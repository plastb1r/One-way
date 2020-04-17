"/routes/{routeId}/placesOnRoute"
import {TokenStorageService} from '../_services/token-storage.service';
 import {HttpClient} from '@angular/common/http';
 import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { PlaceOnRoute } from '../domens/placeOnRoute';

 @Injectable()
 export class PlaceOnRouteService {
   private routeUrl: string;
   currentUser: any;
   constructor(
     private http: HttpClient,
     private token: TokenStorageService
   ) {
     this.currentUser = this.token.getUser();
     this.routeUrl =  'http://localhost:8181/api/auth/routes/';
   }

   getAll(routeId): Observable<PlaceOnRoute[]> {
     return this.http.get<PlaceOnRoute[]>(this.routeUrl + routeId +'/placesOnRoute');
   }
 }