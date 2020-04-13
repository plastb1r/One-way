import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'my-footer',
  templateUrl: './footer.html',
  styleUrls: ['./app.footerComponent.css']

})
export class FooterComponent implements OnInit{
  isLoggedIn = false;
  username: string;
  constructor(private data: DataService ,
    private tokenStorageService: TokenStorageService
  )
  {}

  ngOnInit(){
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
    }
  }
}
