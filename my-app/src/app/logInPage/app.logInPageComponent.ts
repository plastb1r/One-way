import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import { GoogleApiService } from 'ng-gapi';
import { UserService } from 'src/app/services/user.service';
import { FooService } from 'src/app/services/foo.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './logInPage.html',
  styleUrls: ['./app.logInPageComponent.scss']

})
export class LogInPageComponent implements OnInit {
  public sheetId: string;
  public sheet: any;
  public foundSheet: any;

  constructor(private userService: UserService,
              private sheetResource: FooService,
              private route: ActivatedRoute,
              private authService: GoogleAuthService,
              private gapiService: GoogleApiService) {
     this.gapiService.onLoad().subscribe();
  }


  ngOnInit() {
        this.route.fragment.subscribe((fragment) => {

        console.log("fragment" + fragment),
        console.log("profile" + fragment['profile']),
        console.log("email" + fragment['email'])
    })
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
