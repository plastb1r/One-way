import {TokenStorageService} from '../_services/token-storage.service';
 import {HttpClient} from '@angular/common/http';
 import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from 'src/app/domens/location';
import { Parameters } from 'src/app/domens/params';
import { Way } from '../domens/way';

 @Injectable()
 export class ParametersService {
   private paramsUrl: string;
   constructor(
     private http: HttpClient
   ) {
     this.paramsUrl = 'http://localhost:8181/api/auth/generate';
   }

     sendParams(params: Parameters): Observable<any> {
       return this.http.post(this.paramsUrl, params);
     }
 }
