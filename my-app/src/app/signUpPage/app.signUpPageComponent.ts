import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import { User } from 'src/app/domens/user';
import {NgForm} from '@angular/forms';

@Component({
  templateUrl: './signUpPage.html',
  styleUrls: ['./app.signUpPageComponent.scss']

})
export class SignUpPageComponent implements OnInit{
  username: string = "";
  password: string = "";
  email: string = "";

  register(form: NgForm) { 
    this.username = form.controls['username'].value;
    this.password = form.controls['password'].value;
    this.email = form.controls['email'].value;
    console.log("username" + this.username);
    console.log("password" + this.password);
    console.log("email" + this.email);
  }

  ngOnInit() { }
}
