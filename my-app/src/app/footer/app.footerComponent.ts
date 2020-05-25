import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { TriggerService } from '../services/trigger.service';

@Component({
  selector: 'my-footer',
  templateUrl: './footer.html',
  styleUrls: ['./app.footerComponent.css']

})
export class FooterComponent implements OnInit{
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
