import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ViewChild, ElementRef, NgZone} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import {AgmCoreModule, MapsAPILoader, MouseEvent, AgmMap  } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { AgmDirectionModule } from 'agm-direction';
import { UserService } from 'src/app/services/user.service';
import { FooService } from 'src/app/services/foo.service';
import {
    GoogleApiModule,
    GoogleApiService,
    GoogleAuthService,
    NgGapiClientConfig,
    NG_GAPI_CONFIG,
    GoogleApiConfig
} from "ng-gapi";
import { FormComponent } from './form/app.formComponent';
import { HeaderComponent } from './header/app.headerComponent';
import {FooterComponent } from './footer/app.footerComponent';
import {TimeSliderComponent } from './form/sliders/timeSlider/app.slider.timeComponent';
import {FinanceSliderComponent } from './form/sliders/financeSlider/app.slider.financeComponent';
import {DropDownComponent } from './header/dropdown/app.dropdownComponent';
import {MapPageComponent } from './mapPage/app.mapPageComponent';
import {MapFormComponent } from './map/app.MapComponent';
import {HomePageComponent } from './homePage/app.homePageComponent';
import {LandmarkPageComponent } from './landmarkPage/app.landmarkPageComponent';
import {PopularLandmarksPageComponent } from './popularLandmarksPage/app.popularLandmarksPageComponent';
import {WayPageComponent } from './wayPage/app.wayPageComponent';
import {DataService} from 'src/app/services/data.service';

import {HttpService} from 'src/app/services/http.service';
import {ProfilePageComponent} from './profilePage/app.profilePageComponent';
import {MyWaysPageComponent} from './myWaysPage/app.myWaysPageComponent';
import {MyFavoritePlacesPageComponent} from './myFavoritePlacesPage/app.myFavoritePlacesPageComponent';
import {ProfileSidebarComponent} from './profileSidebar/app.profileSidebarComponent';
import {WayParamsPageComponent} from './wayParamsPage/app.wayParamsPageComponent';
import {LogInPageComponent} from './logInPage/app.logInPageComponent';
import {SignUpPageComponent} from './signUpPage/app.signUpPageComponent';
import {RouterModule} from '@angular/router';

let gapiClientConfig: NgGapiClientConfig = {
    client_id: "951523443973-82b3n43cgkbntlrv9gcucinukkl5n36a.apps.googleusercontent.com",
    discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
    ux_mode: "redirect",
    //redirect_uri: "https://ng-gapi-example.stackblitz.io/redirect",
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ].join(" ")
};


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    HeaderComponent,
    FooterComponent,
    TimeSliderComponent,
    FinanceSliderComponent,
    DropDownComponent,
    MapPageComponent,
    MapFormComponent,
    HomePageComponent,
    LandmarkPageComponent,
    PopularLandmarksPageComponent,
    WayPageComponent,
    ProfilePageComponent,
    MyWaysPageComponent,
    MyFavoritePlacesPageComponent,
    ProfileSidebarComponent,
    WayParamsPageComponent,
    LogInPageComponent,
    SignUpPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    SidebarModule.forRoot(),
    FormsModule,
    Ng5SliderModule,
    NgbModule,
    AgmDirectionModule,
    RouterModule.forRoot([{
      path: 'redirect',
      component: AppComponent
    }]),
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ',
      libraries: ['places']
    })
  ],
  providers: [DataService, HttpService, UserService, FooService],
  bootstrap: [AppComponent]
})
export class AppModule { }
