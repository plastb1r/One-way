import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import { User } from 'src/app/domens/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './signUpPage.html',
  styleUrls: ['./app.signUpPageComponent.scss']

})
export class SignUpPageComponent implements OnInit{
  form: any = {};
    isSuccessful = false;
    isSignUpFailed = false;
    errorMessage = '';
  
    constructor(
      private authService: AuthService,
      private router: Router
      ) { }
  
    ngOnInit() {
    }
  
    onSubmit() {
      this.authService.register(this.form).subscribe(
        data => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.reloadPageToLogIn();
        },
        err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      );
    }

    reloadPageToLogIn() {
      //window.location.reload();
      this.router.navigate(['/logInPage']);
      //window.location.replace("http://localhost:4200/logInPage");
  }
  }