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

  digestAuthRequest = function (method, url, username, password) {
    var self = this;
  
    if (typeof CryptoJS === 'undefined' && typeof require === 'function') {
      var CryptoJS = require('crypto-js');
    }
  
    this.scheme = null; // we just echo the scheme, to allow for 'Digest', 'X-Digest', 'JDigest' etc
    this.nonce = null; // server issued nonce
    this.realm = null; // server issued realm
    this.qop = null; // "quality of protection" - '' or 'auth' or 'auth-int'
    this.response = null; // hashed response to server challenge
    this.opaque = null; // hashed response to server challenge
    this.nc = 1; // nonce count - increments with each request used with the same nonce
    this.cnonce = null; // client nonce
  
    // settings
    this.timeout = 10000; // timeout
    this.loggingOn = true; // toggle console logging
  
    // determine if a post, so that request will send data
    this.post = false;
    if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
      this.post = true;
    }
  
    // start here
    // successFn - will be passed JSON data
    // errorFn - will be passed error status code
    // data - optional, for POSTS
    this.request = function(successFn, errorFn, data) {
      // posts data as JSON if there is any
      if (data) {
        self.data = JSON.stringify(data);
      }
      self.successFn = successFn;
      self.errorFn = errorFn;
  
      if (!self.nonce) {
        self.makeUnauthenticatedRequest(self.data);
      } else {
        self.makeAuthenticatedRequest();
      }
    }
    this.makeUnauthenticatedRequest = function(data) {
      self.firstRequest = new XMLHttpRequest();
      self.firstRequest.open(method, url, true);
      self.firstRequest.timeout = self.timeout;
      // if we are posting, add appropriate headers
      if (self.post) {
        self.firstRequest.setRequestHeader('Content-type', 'application/json');
      }
  
      self.firstRequest.onreadystatechange = function() {
  
        // 2: received headers,  3: loading, 4: done
        if (self.firstRequest.readyState === 2) {
  
          var responseHeaders = self.firstRequest.getAllResponseHeaders();
          responseHeaders = responseHeaders.split('\n');
          // get authenticate header
          var digestHeaders;
          for(var i = 0; i < responseHeaders.length; i++) {
            if (responseHeaders[i].match(/www-authenticate/i) != null) {
              digestHeaders = responseHeaders[i];
            }
          }
  
          if (digestHeaders != null) {
            // parse auth header and get digest auth keys
            digestHeaders = digestHeaders.slice(digestHeaders.indexOf(':') + 1, -1);
            digestHeaders = digestHeaders.split(',');
            self.scheme = digestHeaders[0].split(/\s/)[1];
            for (var i = 0; i < digestHeaders.length; i++) {
              var equalIndex = digestHeaders[i].indexOf('='),
                key = digestHeaders[i].substring(0, equalIndex),
                val = digestHeaders[i].substring(equalIndex + 1);
              val = val.replace(/['"]+/g, '');
              // find realm
              if (key.match(/realm/i) != null) {
                self.realm = val;
              }
              // find nonce
              if (key.match(/nonce/i) != null) {
                self.nonce = val;
              }
              // find opaque
              if (key.match(/opaque/i) != null) {
                self.opaque = val;
              }
              // find QOP
              if (key.match(/qop/i) != null) {
                self.qop = val;
              }
            }
            // client generated keys
            self.cnonce = self.generateCnonce();
            self.nc++;
            // if logging, show headers received:
            self.log('received headers:');
            self.log('	realm: '+self.realm);
            self.log('	nonce: '+self.nonce);
            self.log('	opaque: '+self.opaque);
            self.log('	qop: '+self.qop);
            // now we can make an authenticated request
            self.makeAuthenticatedRequest();
          }
        }
        if (self.firstRequest.readyState === 4) {
          if (self.firstRequest.status === 200) {
            self.log('Authentication not required for '+url);
            if (self.firstRequest.responseText !== 'undefined') {
              if (self.firstRequest.responseText.length > 0) {
                // If JSON, parse and return object
                if (self.isJson(self.firstRequest.responseText)) {
                  self.successFn(JSON.parse(self.firstRequest.responseText));
                } else {
                  self.successFn(self.firstRequest.responseText);
                }
              }
            } else {
              self.successFn();
            }
          }
        }
      }
      // send
      if (self.post) {
        // in case digest auth not required
        self.firstRequest.send(self.data);
      } else {
        self.firstRequest.send();
      }
      self.log('Unauthenticated request to '+url);
  
      // handle error
      self.firstRequest.onerror = function() {
        if (self.firstRequest.status !== 401) {
          self.log('Error ('+self.firstRequest.status+') on unauthenticated request to '+url);
          self.errorFn(self.firstRequest.status);
        }
      }
    }
    this.makeAuthenticatedRequest= function() {
      self.response = self.formulateResponse();
      self.authenticatedRequest = new XMLHttpRequest();
      self.authenticatedRequest.open(method, url, true);
      self.authenticatedRequest.timeout = self.timeout;
      var digestAuthHeader = self.scheme+' '+
        'username="'+username+'", '+
        'realm="'+self.realm+'", '+
        'nonce="'+self.nonce+'", '+
        'uri="'+url+'", '+
        'response="'+self.response+'", '+
        'opaque="'+self.opaque+'", '+
        'qop='+self.qop+', '+
        'nc='+('00000000' + self.nc).slice(-8)+', '+
        'cnonce="'+self.cnonce+'"';
      self.authenticatedRequest.setRequestHeader('Authorization', digestAuthHeader);
      self.log('digest auth header response to be sent:');
      self.log(digestAuthHeader);
      // if we are posting, add appropriate headers
      if (self.post) {
        self.authenticatedRequest.setRequestHeader('Content-type', 'application/json');
      }
      self.authenticatedRequest.onload = function() {
        // success
        if (self.authenticatedRequest.status >= 200 && self.authenticatedRequest.status < 400) {
          // increment nonce count
          self.nc++;
          // return data
          if (self.authenticatedRequest.responseText !== 'undefined' && self.authenticatedRequest.responseText.length > 0 ) {
            // If JSON, parse and return object
            if (self.isJson(self.authenticatedRequest.responseText)) {
              self.successFn(JSON.parse(self.authenticatedRequest.responseText));
            } else {
              self.successFn(self.authenticatedRequest.responseText);
            }
          } else {
            self.successFn();
          }
        }
        // failure
        else {
          self.nonce = null;
          self.errorFn(self.authenticatedRequest.status);
        }
      }
      // handle errors
      self.authenticatedRequest.onerror = function() {
        self.log('Error ('+self.authenticatedRequest.status+') on authenticated request to '+url);
        self.nonce = null;
        self.errorFn(self.authenticatedRequest.status);
      };
      // send
      if (self.post) {
        self.authenticatedRequest.send(self.data);
      } else {
        self.authenticatedRequest.send();
      }
      self.log('Authenticated request to '+url);
    }
    // hash response based on server challenge
    this.formulateResponse = function() {
      var HA1 = CryptoJS.MD5(username+':'+self.realm+':'+password).toString();
      var HA2 = CryptoJS.MD5(method+':'+url).toString();
      var response = CryptoJS.MD5(HA1+':'+
        self.nonce+':'+
        ('00000000' + self.nc).slice(-8)+':'+
        self.cnonce+':'+
        self.qop+':'+
        HA2).toString();
      return response;
    }
    // generate 16 char client nonce
    this.generateCnonce = function() {
      var characters = 'abcdef0123456789';
      var token = '';
      for (var i = 0; i < 16; i++) {
        var randNum = Math.round(Math.random() * characters.length);
        token += characters.substr(randNum, 1);
      }
      return token;
    }
    this.abort = function() {
      self.log('[digestAuthRequest] Aborted request to '+url);
      if (self.firstRequest != null) {
        if (self.firstRequest.readyState != 4) self.firstRequest.abort();
      }
      if (self.authenticatedRequest != null) {
        if (self.authenticatedRequest.readyState != 4) self.authenticatedRequest.abort();
      }
    }
    this.isJson = function(str) {
      try {
      JSON.parse(str);
      } catch (e) {
      return false;
      }
      return true;
    }
    this.log = function(str) {
      if (self.loggingOn) {
        console.log('[digestAuthRequest] '+str); // this error shows up in console
      }
    }
    this.version = function() { return '0.8.0' }
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

  getRequestTest() {
    var digestRequest = require('request-digest')('username', 'password');
    digestRequest.requestAsync({
      host: 'http://test.com',
      path: '/api/v1/test.json',
      port: 80,
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
  }

  test(){

    //this.getRequest().subscribe(data => {console.log("data" + data)});
  }

  postRequest(){
    var postData = {
      address: '123 main st.',
      city: 'Denver',
      state: 'Colorado'
   }
   var url = '';

   
   // create new digest request object
   // because method (POST vs GET) is different
   // otherwise we could re-use the first one
   var postReq = new this.digestAuthRequest('POST', url, this.username, this.password);
   postReq.request(function(data) { 
     // success callback
     // data probably a success message
   },function(errorCode) { 
     // error callback
     // tell user request failed
   }, postData);
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
