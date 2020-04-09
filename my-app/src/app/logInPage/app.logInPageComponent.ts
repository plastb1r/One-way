import { Component, OnInit, Injectable } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import { GoogleApiService } from 'ng-gapi';
import { UserService } from 'src/app/services/user.service';
import { FooService } from 'src/app/services/foo.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/domens/user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Data } from '../domens/data';
import { DataService } from '../services/data.service';
// import { url } from 'inspector';

@Component({
  templateUrl: './logInPage.html',
  styleUrls: ['./app.logInPageComponent.scss']

})
@Injectable()
export class LogInPageComponent implements OnInit {
  public sheetId: string = '';
  public sheet: any;
  public foundSheet: any;
  submitted = false;
  user: User;

  url: string = '';
  uri: string = '';
  scheme: string = ''; // we just echo the scheme, to allow for 'Digest', 'X-Digest', 'JDigest' etc
  realm: string = '';
  nonce: string = '';
  qop: string = ''; // "quality of protection" - '' or 'auth' or 'auth-int'
  response: string = ''; // hashed response to server challenge
  nc: number; // nonce count - increments with each request used with the same nonce
  cnonce: string = '';

  method: string = '';
  timeout: number;
  loggingOn: boolean;

  username = '';
  password = '';

  constructor(private userService: UserService,
    private sheetResource: FooService,
    private route: ActivatedRoute,
    private authService: GoogleAuthService,
    private gapiService: GoogleApiService,
    private http: HttpClient,
    private data: DataService
  ) {
    this.gapiService.onLoad().subscribe();
  }

  //первый запрос на получения nonce и realm
  ngOnInit() {
    this.firstDigestRequest();
  }

  firstDigestRequest() {
    this.uri = 'api/user/1';
    this.url = 'http://localhost:8181/api/user/1';
    this.method = 'GET';
    this.nc = 1;

    const request = new XMLHttpRequest();
    request.open('GET', this.url, false);
    request.send();

    if (request.status === 401) {
      var digestHeaderArgs = request.getResponseHeader('WWW-Authenticate').split(',');

      this.scheme = digestHeaderArgs[0].split(/\s/)[0];

      for (let i = 0; i < digestHeaderArgs.length; i++) {
        const equalIndex = digestHeaderArgs[i].indexOf('=');

        const key = digestHeaderArgs[i].substring(0, equalIndex);
        let val = digestHeaderArgs[i].substring(equalIndex + 1);
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
    }
  }

  //после ввода данных пользователем, собираем все вместе => MD5(...) => GET обратно на сервер => получаем данные
  digestLogIn(form: NgForm) {
    this.username = form.controls.username.value;
    this.password = form.controls.password.value;

    const authenticatedRequest = new XMLHttpRequest();
    const authHeader = this.secondDigestRequest(authenticatedRequest);

    if (authenticatedRequest.status === 200) {
      console.log('okey, you in');
      console.log('response - ' + authenticatedRequest.responseText);
      sessionStorage.setItem('authHeader', authHeader);
      sessionStorage.setItem('userPassword', this.password);
      console.log(authHeader);
    } else {
      console.log('smth wrong - ' + authenticatedRequest.status);
    }
  }

  secondDigestRequest(authenticatedRequest: XMLHttpRequest) {
    this.cnonce = this.data.generateCnonce();
    this.response = this.data.formulateResponse(this.username, this.password,
      this.method, this.realm, this.nonce, this.uri, this.cnonce, this.qop, this.nc);

    authenticatedRequest.open(this.method, this.url, false);
    //authenticatedRequest.open(this.method, this.uri, false);

    const digestAuthHeader = this.scheme + ' ' +
      'username="' + this.username + '", ' +
      'realm="' + this.realm + '", ' +
      'nonce="' + this.nonce + '", ' +
      'uri="' + this.uri + '", ' +
      'response="' + this.response + '", ' +
      'qop=' + this.qop + ', ' +
      'nc=' + ('00000000' + this.nc).slice(-8) + ', ' +
      'cnonce="' + this.cnonce + '"';

    authenticatedRequest.setRequestHeader('Authorization', digestAuthHeader);
    authenticatedRequest.send();

    return digestAuthHeader;
  }

  //this.getRequest().subscribe(data => {console.log("data" + data)});
  public isLoggedIn(): boolean {
    return this.userService.isUserSignedIn();
  }
}
