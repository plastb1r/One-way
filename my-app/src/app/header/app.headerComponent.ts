import {Component, OnInit} from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { TriggerService } from '../services/trigger.service';

@Component({
  selector: 'header',
  templateUrl: './header.html',
  styleUrls: ['./app.headerComponent.css']

})
export class HeaderComponent implements OnInit{
  isLoggedIn = false;
  username: string;

  constructor(private tokenStorageService: TokenStorageService,
    private triggerService: TriggerService) { }

  ngOnInit() {
    this.checkLogin();
    this.triggerService.trigger$.subscribe(() => this.checkLogin());
  }

  checkLogin(){
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
    }
  }
  
}
