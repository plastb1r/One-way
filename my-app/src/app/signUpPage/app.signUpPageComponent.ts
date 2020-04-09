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

@Component({
  templateUrl: './signUpPage.html',
  styleUrls: ['./app.signUpPageComponent.scss']

})
export class SignUpPageComponent implements OnInit{
  urlReg: string;
  username = '';
  password = '';

  constructor(private http: HttpClient){ }
 
  registrater(form: NgForm){
      this.username = form.controls.username.value;
      this.password = form.controls.password.value;

      this.urlReg = 'http://localhost:8181/api/auth/registration';
      const requestReg = new XMLHttpRequest();

      requestReg.open('POST', this.urlReg, false );
      const CryptoJS = require('crypto-js');
      requestReg.setRequestHeader('Content-Type','application/json');
      requestReg.send(JSON.stringify({name: this.username, password: CryptoJS.MD5(this.password).toString() ,email:" ",
      phoneNumber: "89999999999", accountNonExpired: true ,accountNonLocked: true, credentialsNonExpired: true, enabled: true}));
      console.log("response" + requestReg.response);
  }
  ngOnInit(){
  }
}
