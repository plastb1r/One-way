import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Location } from 'src/app/domens/location';
import { Way } from 'src/app/domens/way';

@Injectable({ providedIn: 'root' })
export class DataService{
  location: Location ;
  landmarkLoc: Location ;
  rating: number ;
  address: string ;
  number: string ;
  name: string ;
  photo: Array<string>;
  types: Array<string>;
  locations: Array<Location> ;
  wayLocations: Array<Location> = new Array<Location>();
  way: Way = new Way(0,new Array<Location>(), "", "");
  cityName: string;
  favP: Array<Location> = new Array<Location>();

  private locationSourse = new BehaviorSubject<Location>(this.location);
  private ratingSourse = new BehaviorSubject<number>(this.rating);
  private addressSourse = new BehaviorSubject<string>(this.address);
  private photoSourse = new BehaviorSubject<Array<string>>(this.photo);
  private nameSourse = new BehaviorSubject<string>(this.name);
  private typesSourse = new BehaviorSubject<Array<string>>(this.types);
  private numberSourse = new BehaviorSubject<string>(this.number);
  private locationsSourse = new BehaviorSubject<Array<Location>>(this.locations);
  private wayLocationsSourse = new BehaviorSubject<Array<Location>>(this.wayLocations);
  private waySourse = new BehaviorSubject<Way>(this.way);
  private cityNameSourse = new BehaviorSubject<string>(this.cityName);
  private favPSourse = new BehaviorSubject<Array<Location>>(this.favP);

  currentRat = this.ratingSourse.asObservable();
  currentAds = this.addressSourse.asObservable();
  currentPh = this.photoSourse.asObservable();
  currentName = this.nameSourse.asObservable();
  currentTypes = this.typesSourse.asObservable();
  currentNbr = this.numberSourse.asObservable();
  currentLoc = this.locationSourse.asObservable();
  currentLocations = this.locationsSourse.asObservable();
  currentWayLocations = this.wayLocationsSourse.asObservable();
  currentWay = this.waySourse.asObservable();
  currentCityName = this.cityNameSourse.asObservable();
  currentFavP = this.favPSourse.asObservable();

  constructor() {}

  changeFavP(loc: Location, f: Array<Location>) {
    
      this.favP = f;
      this.favP.push(loc);
      this.favPSourse.next(this.favP);
  }

  changeFavPRemove(loc: Location, f: Array<Location>){
    this.favP = f;
    const index: number = this.favP.indexOf(loc);
    this.favP.splice(index, 1);
    this.favPSourse.next(this.favP);
  }

  changeCityName(cityName: string) {
    this.cityName = cityName;
    this.cityNameSourse.next(cityName)
  }

  changeWay(loc: Location, way: Way, RemOrDel: number){
    this.way = way;
    if(RemOrDel == 1){
      this.way.points.push(loc);
    }
    else {
      this.way.points.forEach(f => {
        if (f.lat == loc.lat && f.lng == loc.lng)
        {
          const index: number = this.way.points.indexOf(f);
          this.way.points.splice(index, 1);}
      })
    }
    this.waySourse.next(this.way);
  }

  changeWayLocations(loc: Location){
    this.wayLocations.push(loc);
    this.wayLocationsSourse.next(this.wayLocations)
  }

  changeWay1( way: Way){
    this.way = way;
    this.waySourse.next(this.way);
  }

  /*changeWayLocations(locs: Array<Location>){

    this.wayLocations = locs;
    this.wayLocationsSourse.next(locs)
  }*/

  changeLocation(loc: Location) {
    this.location = loc;
    this.locationSourse.next(loc)
  }
  changeLocations(locs: Array<Location>) {
    this.locations = locs;
    this.locationsSourse.next(locs)
  }

  changeLandMark(loc: Location){
    this.location = loc;
    this.locationSourse.next(loc);

  }
  changeAddress(address: string){
    this.address = address;
    this.addressSourse.next(address);
  }
  changeName(name: string){
    this.name = name;
    this.nameSourse.next(name);
  }
  changeNumber(number: string){
    this.number = number;
    this.numberSourse.next(number);
  }
  changeRating(rating: number){
    this.rating = rating;
    this.ratingSourse.next(rating);
  }
  changePhotos(photo: Array<string>){
    this.photo = photo;
    this.photoSourse.next(photo);
  }
  changeTypes(types: Array<string>){
    this.types = types;
    this.typesSourse.next(types);
  }
}
