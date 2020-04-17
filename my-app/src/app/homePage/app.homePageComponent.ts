import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  templateUrl: './homePage.html',
  styleUrls: ['./app.homePageComponent.css']

})
export class HomePageComponent implements OnInit{
    location: Array<Location>;
    address: string = "Moscow, Russia";
    routerLink = '/signUpPage';
    isLoggedIn = false;
    label = 'Регистрация'

    @ViewChild('search', {static: false})
    public searchElementRef: ElementRef;


    constructor(
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone,
      private data: DataService,
      private tokenStorageService: TokenStorageService
    ) { 
      this.isLoggedIn = !!this.tokenStorageService.getToken();
    }

    ngOnInit() {
      this.mapsAPILoader.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["(regions)"]
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
          this.location = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), placeId: place.place_id}];
          this.address = place.formatted_address;
          });
        });
      });
      if(this.isLoggedIn){
        this.routerLink = '/profilePage';
        this.label = 'Добро пожаловать в личный кабинет, ' + this.tokenStorageService.getUser().username;
      }
    }

  _newLocation(index: number){
    switch(index){
      case 0: {
        this.location = [{lat: 52.5200066, lng: 13.404954, placeId: ''}];
        this.address = 'Берлин, Germany';
        break;
      };
      case 1: {
        this.location = [{lat: 47.497912, lng: 19.040235, placeId: ''}];
        this.address = 'Будапешт, Hungary';
        break;
      };
      case 2: {
        this.location = [{lat: 51.5073509, lng: -0.1277583, placeId:''}];
        this.address = 'Лондон, UK';
        break;
      };
      case 3: {
        this.location = [{lat: 59.9342802, lng: 30.3350986, placeId:''}];
        this.address = 'Санкт-Петербург, Russia';
        break;
      };
      case 4: {
        this.location = [{lat: 55.755826, lng: 37.6173, placeId:''}];
        this.address = 'Москва, Russia';
        break;
      };
      case 5: {
        this.location = [{lat: 48.856614, lng: 2.3522219, placeId: ''}];
        this.address = 'Париж, France';
        break;
      };
      default:
        break;
    }
    sessionStorage.removeItem('cityAddress');
    sessionStorage.setItem('cityAddress', this.address);
    sessionStorage.removeItem('cityAddressLocat');
    sessionStorage.setItem('cityAddressLocat', JSON.stringify(this.location));
    this.data.changeLocations(this.location);
  }
}
