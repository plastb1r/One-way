import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { RoutesService } from '../services/routes.service';
import { TriggerService } from '../services/trigger.service';

@Component({
  templateUrl: './logInPage.html',
  styleUrls: ['./app.logInPageComponent.scss']

})
@Injectable()
export class LogInPageComponent implements OnInit {
    form: any = {};
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    roles: string[] = [];

  
    constructor(private authService: AuthService, private tokenStorage: TokenStorageService,private router: Router,     private routeService: RoutesService,  private triggerService: TriggerService) { }
  
    ngOnInit() {
      if (this.tokenStorage.getToken()) {
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
      }
    }
  
    onSubmit() {
      this.authService.login(this.form).subscribe(
        data => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
  
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          let way = JSON.parse(sessionStorage.getItem("WayToSave"));
          this.routeService.addWay(way).subscribe(data => {
            sessionStorage.removeItem("WayToSave");
          });
          this.reloadPage();
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    }
    reloadPage() {
      //window.location.reload();
      this.router.navigate(['/profilePage']);
      this.triggerService.triggerOnMyButton();
      //window.location.replace("http://localhost:4200/profile");
      
      }
    //reloadPage() {
      //window.location.reload();
      //this.router.navigate(['/profilePage']);
      //window.location.replace("http://localhost:4200/profilePage");
      //window.location.replace("http://167.172.117.75:8080/onestep4ward/profilePage");
    //}
}