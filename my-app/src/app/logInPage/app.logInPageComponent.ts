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

<<<<<<< HEAD
  getRequest(){
    var url = 'http://localhost:8181/api/user/1/routes';
    const httpOptions = {
      headers: new HttpHeaders({
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Requested-With": "XMLHttpRequest",
        "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        "WWW-Authenticate" : "Digest",
        "realm":"DigestAuthRealm", 
        "domain": "/",       
        "nonce":"", 
        "algorithm":"MD5", 
        "qop":"auth",
      })
    };
    let headers = new HttpHeaders().set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    headers = headers.set('WWW-Authenticate', 'Digest');
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('X-Requested-With', 'XMLHttpRequest');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    headers = headers.set('realm', 'DigestAuthRealm');
    headers = headers.set('domain', '/api/user/1/routes');
    headers = headers.set('nonce', 'MTU4NDU3MDA3MjgyNDoxZmQzYjIxZTA0N2Y0NGU5YTVhZjM0ZDFhZjYzY2EyZA==');
    headers = headers.set('algorithm', 'MD5');
    headers = headers.set('qop', 'auth');
    headers = new HttpHeaders({
    })
    // create digest request object
    //var CryptoJS = require('crypto-js');
    return this.http.get(url, {headers: headers});
=======
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
>>>>>>> 8c93d0a6982462452839828ce6dd490e011c8e77

    const authenticatedRequest = new XMLHttpRequest();
    this.makeAuthenticatedRequest(authenticatedRequest);


    if (authenticatedRequest.status === 200) {
      console.log('okey, you in');
      console.log(authenticatedRequest.responseText);
    } else {
      console.log('smth wrong - ' + authenticatedRequest.status);
    }
  }

<<<<<<< HEAD
  /*getRequestTest() {
    var digestRequest = require('request-digest')('username', 'password');
    digestRequest.requestAsync({
      host: 'http://localhost',
      path: '/api/1/routes',
      port: 8181,
      method: 'GET',
      excludePort: false,
      headers: {
        'Custom-Header': 'OneValue',
        'Other-Custom-Header': 'OtherValue'
      }
    })
    .then(function (response) {
      console.log(response.body);
    })
    .catch(function (error) {
      console.log(error.statusCode);
      console.log(error.body);
    });
  }*/

  getRequestTest(){
    var digestRequest = require('request-digest')('username', 'password');
    digestRequest.request({
      host: 'http://localhost',
      path: '/api/1/routes',
      port: 8181,
      method: 'GET',
      headers: {
        'Custom-Header': 'OneValue',
        'Other-Custom-Header': 'OtherValue'
      }
    }, function (error, response, body) {
      if (error) {
        throw error;
      }
     
      console.log(body);
    });
  }

  

  test(){
=======
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

    const HA1 = CryptoJS.MD5(this.username + ':' + this.realm + ':' + CryptoJS.MD5(this.password)).toString();
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
>>>>>>> 8c93d0a6982462452839828ce6dd490e011c8e77

    //this.getRequest().subscribe(data => {console.log("data" + data)});
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
