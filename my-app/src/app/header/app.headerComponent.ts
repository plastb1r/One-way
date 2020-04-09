import {Component, OnInit} from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'header',
  templateUrl: './header.html',
  styleUrls: ['./app.headerComponent.css']

})
export class HeaderComponent implements OnInit{
  routerLink = '';
  nameOfLink = '';

  constructor(private data: DataService ){
  
  }
  /*public setLink(){
    if(sessionStorage.getItem("UserName")){
      this.nameOfLink = sessionStorage.getItem("UserName");
      this.routerLink = "/profilePage";
    }
    else {
      this.nameOfLink = "Войти";
      this.routerLink = "/logInPage";
    }
  }*/
  
  ngOnInit(){
    if(sessionStorage.getItem("UserName")){
      this.data.linkName$.next(sessionStorage.getItem("UserName"));
      this.data.link$.next("/profilePage");
    }
    else {
      this.data.linkName$.next("Войти");
      this.data.link$.next("/logInPage");
    }
  }
}
