import {Component, OnInit} from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'header',
  templateUrl: './header.html',
  styleUrls: ['./app.headerComponent.css']

})
export class HeaderComponent implements OnInit{
  isLoggedIn = false;
  username: string;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
    }
  }
  /*ngOnInit(){
    if(sessionStorage.getItem("UserName")){
      this.data.linkName$.next(sessionStorage.getItem("UserName"));
      this.data.link$.next("/profilePage");
    }
    else {
      this.data.linkName$.next("Войти");
      this.data.link$.next("/logInPage");
    }
  }*/
}
