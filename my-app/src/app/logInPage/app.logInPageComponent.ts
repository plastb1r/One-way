import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import { GoogleApiService } from 'ng-gapi';
import { UserService } from 'src/app/services/user.service';
import { FooService } from 'src/app/services/foo.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/domens/user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
// import { url } from 'inspector';

@Component({
  templateUrl: './logInPage.html',
  styleUrls: ['./app.logInPageComponent.scss']

})
export class LogInPageComponent implements OnInit {
  public sheetId: string;
  public sheet: any;
  public foundSheet: any;
  submitted = false;
  user: User;

  url: string;
  uri: string;
  scheme: string; // we just echo the scheme, to allow for 'Digest', 'X-Digest', 'JDigest' etc
  realm: string;
  nonce: string;
  qop: string; // "quality of protection" - '' or 'auth' or 'auth-int'
  response: string; // hashed response to server challenge
  nc: number; // nonce count - increments with each request used with the same nonce
  cnonce: string;

  method: string;
  timeout: number;
  loggingOn: boolean;

  username = '';
  password = '';

  constructor(private userService: UserService,
    private sheetResource: FooService,
    private route: ActivatedRoute,
    private authService: GoogleAuthService,
    private gapiService: GoogleApiService,
    private http: HttpClient
  ) {
    this.gapiService.onLoad().subscribe();
  }

  //первый запрос на получения nonce и realm
  ngOnInit() {
    this.uri = 'api/user/1';
    this.url = 'http://localhost:8181/api/user/1';
    this.method = 'GET';
    this.nc = 1;

    const request = new XMLHttpRequest();
    request.open('get', this.url, false);
    request.send();

    if (request.status === 401) {
      var digestHeadersArr = request.getResponseHeader('WWW-Authenticate').split(',');

      this.scheme = digestHeadersArr[0].split(/\s/)[0];

      for (let i = 0; i < digestHeadersArr.length; i++) {
        const equalIndex = digestHeadersArr[i].indexOf('=');

        const key = digestHeadersArr[i].substring(0, equalIndex);
        let val = digestHeadersArr[i].substring(equalIndex + 1);
        val = val.replace(/['"]+/g, '');

        if (key.match(/realm/i) != null) {
          this.realm = val;
        }
        if (key.match(/nonce/i) != null) {
          this.nonce = val;
        }
        if (key.match(/qop/i) != null) {
          this.qop = val;
        }
      }

      console.log('realm = ' + this.realm);
      console.log('nonce = ' + this.nonce);
    }
  }

  //после ввода данных пользователем, собираем все вместе => MD5(...) => GET обратно на сервер => получаем данные
  digestLogIn(form: NgForm) {
    this.username = form.controls.username.value;
    this.password = form.controls.password.value;
    console.log('username ' + this.username);
    console.log('password ' + this.password);

    const authenticatedRequest = new XMLHttpRequest();
    this.makeAuthenticatedRequest(authenticatedRequest);


    if (authenticatedRequest.status === 200) {
      console.log('okey, you in');
      console.log(authenticatedRequest.responseText);
    } else {
      console.log('smth wrong - ' + authenticatedRequest.status);
    }
  }

  makeAuthenticatedRequest(authenticatedRequest: XMLHttpRequest) {
    this.response = this.formulateResponse();
    authenticatedRequest.open(this.method, this.url, false);

    const digestAuthHeader = this.scheme + ' ' +
      'username="' + this.username + '", ' +
      'realm="' + this.realm + '", ' +
      'nonce="' + this.nonce + '", ' +
      'uri="' + this.uri + '", ' +
      'response="' + this.response + '", ' +
      'qop=' + this.qop + ', ' +
      'nc=' + ('00000000' + this.nc).slice(-8) + ', ' +
      'cnonce="' + this.cnonce + '"';

    console.log(digestAuthHeader);

    authenticatedRequest.setRequestHeader('Authorization', digestAuthHeader);
    authenticatedRequest.send();
  }

  formulateResponse() {
    const CryptoJS = require('crypto-js');

    const HA1 = CryptoJS.MD5(this.username + ':' + this.realm + ':' + this.password).toString();
    const HA2 = CryptoJS.MD5(this.method + ':' + this.uri).toString();
    this.cnonce = this.generateCnonce();

    const response = CryptoJS.MD5(HA1 + ':' +
      this.nonce + ':' +
      ('00000000' + this.nc).slice(-8) + ':' +
      this.cnonce + ':' +
      this.qop + ':' +
      HA2).toString();

    return response;
  }

  generateCnonce() {
    const characters = 'abcdef0123456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
      const randNum = Math.round(Math.random() * characters.length);
      token += characters.substr(randNum, 1);
    }
    return token;
  }

  public isLoggedIn(): boolean {
    return this.userService.isUserSignedIn();
  }

  public signIn() {
    this.userService.signIn();
  }

  public signOut() {
    this.userService.signOut();
  }

}
