import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Location } from 'src/app/domens/location';
import { Way } from 'src/app/domens/way';
import { Subject } from 'rxjs';
import { PlaceDetails } from '../domens/placeDetails';

@Injectable({ providedIn: 'root' })
export class DataService {
  locations: Array<Location> = new Array<Location>();


  /*public linkName$ = new BehaviorSubject<string>("Войти");
  public link$ = new BehaviorSubject<string>("/logInPage");
  public linkNameInFooter$ = new BehaviorSubject<string>("Войти");

  public isUserLoggedIn = new Subject();
  setUserLoggedIn(loggedIn: boolean) {
    this.isUserLoggedIn.next(loggedIn);
  }*/

  private locationsSourse = new BehaviorSubject<Array<Location>>(this.locations);
  currentLocations = this.locationsSourse.asObservable();

  constructor() { }

  changeLocations(loc: Location) {
    this.locations.push(loc);
    this.locationsSourse.next(this.locations)
  }
}
