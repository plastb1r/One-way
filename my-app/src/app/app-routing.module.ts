import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapPageComponent } from './mapPage/app.mapPageComponent';
import {HomePageComponent } from './homePage/app.homePageComponent';
import {LandmarkPageComponent } from './landmarkPage/app.landmarkPageComponent';
import {PopularLandmarksPageComponent } from './popularLandmarksPage/app.popularLandmarksPageComponent';
import {WayPageComponent } from './wayPage/app.wayPageComponent';
import {ProfilePageComponent} from './profilePage/app.profilePageComponent';
import {MyWaysPageComponent} from './myWaysPage/app.myWaysPageComponent';
import {MyFavoritePlacesPageComponent} from './myFavoritePlacesPage/app.myFavoritePlacesPageComponent';
import {WayParamsPageComponent} from './wayParamsPage/app.wayParamsPageComponent';
import {LogInPageComponent} from './logInPage/app.logInPageComponent';
import {SignUpPageComponent} from 'src/app/signUpPage/app.signUpPageComponent';
import { BoardUserComponent } from './board-user/board-user.component';

const routes: Routes = [
  {
    path: 'mapPage',
    component: MapPageComponent
  },
  { path: 'user', component: BoardUserComponent },
  { path: '', redirectTo: 'homePage', pathMatch: 'full' },
  {
    path: 'homePage',
    component: HomePageComponent
  },
  {
    path: 'landmarkPage',
    component: LandmarkPageComponent
  },
  {
    path: 'popularLandmarksPage',
    component: PopularLandmarksPageComponent
  },
  {
    path: 'signUpPage',
    component: SignUpPageComponent
  },
  {
    path: 'wayPage',
    component: WayPageComponent
  },
  {
    path: 'profilePage',
    component: ProfilePageComponent
  },
  {
    path: 'myWaysPage',
    component: MyWaysPageComponent
  },
  {
    path: 'myFavoritePlacesPage',
    component: MyFavoritePlacesPageComponent
  },
  {
    path: 'logInPage',
    component: LogInPageComponent
  },
  {
    path: 'wayParamsPage',
    component: WayParamsPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
