import {TokenStorageService} from '../_services/token-storage.service';
 import {HttpClient} from '@angular/common/http';
 import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from 'src/app/domens/location';
import { GlobalVariable } from '../services/global';

 @Injectable()
 export class PlacesService {
   private placesUrl: string;
   currentUser: any;
   constructor(
     private http: HttpClient,
     private token: TokenStorageService
   ) {
     this.currentUser = this.token.getUser();
     this.placesUrl = GlobalVariable.BASE_API_URL + 'places';
   }
     getById(id): Observable<Location> {
       return this.http.get<Location>(this.placesUrl + '/' + id);
   }

     addPlace(place: Location) {
       return this.http.put<Location>(this.placesUrl, place);
     }

     deleteById(id: string) {
       return this.http.delete(this.placesUrl + '/' + id);
     }

     getAll(): Observable<Location[]> {
       return this.http.get<Location[]>(this.placesUrl);
     }
 }
