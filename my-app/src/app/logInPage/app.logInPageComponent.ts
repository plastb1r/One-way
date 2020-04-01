import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import { GoogleApiService } from 'ng-gapi';
import { UserService } from 'src/app/services/user.service';
import { FooService } from 'src/app/services/foo.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {User} from 'src/app/domens/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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

  username: string = "";
  password: string = "";

  constructor(private userService: UserService,
              private sheetResource: FooService,
              private route: ActivatedRoute,
              private authService: GoogleAuthService,
              private gapiService: GoogleApiService,
              private http: HttpClient
              ) {
     this.gapiService.onLoad().subscribe();
  }


  ngOnInit() {
        this.route.fragment.subscribe((fragment) => {

        console.log("fragment" + fragment),
        console.log("profile" + fragment['profile']),
        console.log("email" + fragment['email'])
    })
  }

  public doSignIn() {

    // Grab values from form


  }

  logIn(form: NgForm) { 
    this.username = form.controls['username'].value;
    this.password = form.controls['password'].value;
    console.log("username" + this.username);
    console.log("password" + this.password);
  }

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

    /*var getRequest = new this.digestAuthRequest('GET', url, this.username, this.password);
    

    // make the request
    getRequest.request(function(data) { 
      // success callback
      // do something with the data
    },function(errorCode) { 
      // error callback
      // tell user request failed
    });*/

  }

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
