import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { TriggerService } from '../services/trigger.service';

@Component({
  selector: 'profile-sidebar',
  templateUrl: './profileSidebar.html',
  styleUrls: ['./app.profileSidebarComponent.scss']

})
export class ProfileSidebarComponent implements OnInit{
  isLoggedIn = false;
  username: string;
  constructor(private data: DataService ,
    private tokenStorageService: TokenStorageService,
    private triggerService: TriggerService,
    private router: Router
  )
  {}

  ngOnInit(){
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
    }
  }
  
  logout() {
    this.tokenStorageService.signOut();
    this.router.navigate(['/logInPage']);
    this.triggerService.triggerOnMyButton();
    //window.location.replace("http://167.172.117.75:8080/onestep4ward/logInPage");
  }
  
}
