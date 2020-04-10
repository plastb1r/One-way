import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'my-footer',
  templateUrl: './footer.html',
  styleUrls: ['./app.footerComponent.css']

})
export class FooterComponent implements OnInit{
  routerLink = '';
  nameOfLink = '';

  constructor(private data: DataService ){
  
  }
  ngOnInit(){
    if(sessionStorage.getItem("UserName")){
      this.data.linkNameInFooter$.next("Личный кабинет");
      this.data.link$.next("/profilePage");
    }
    else {
      this.data.linkName$.next("Войти");
      this.data.link$.next("/logInPage");
    }
  }
}
