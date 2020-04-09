import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';

@Component({
  selector: 'profile-sidebar',
  templateUrl: './profileSidebar.html',
  styleUrls: ['./app.profileSidebarComponent.scss']

})
export class ProfileSidebarComponent implements OnInit{
  userName='';

  constructor(private data: DataService ){}
  ngOnInit(){
    this.userName = sessionStorage.getItem("UserName");
  }
  public logOut(){
    sessionStorage.removeItem("authHeader");
    sessionStorage.removeItem("UserName");
    console.log("You have been successfully log out");
  }
}
