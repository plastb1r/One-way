import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';

@Component({
  templateUrl: './homePage.html',
  styleUrls: ['./app.homePageComponent.css']

})
export class HomePageComponent implements OnInit{
    private geoCoder;
    location: Array<Location>;
    address: string = "Moscow, Russia";

    @ViewChild('search', {static: false})
    public searchElementRef: ElementRef;


    constructor(
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone,
      private data: DataService
    ) { }


    ngOnInit() {
      //load Places Autocomplete

      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder;
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["(regions)"]
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
          this.location = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: 12, placeId: place.place_id,  choose: false}];
          this.address = place.formatted_address;
          //this.bound = place.postal_code;
          });
        });
      });
    }

  _newLocation(index: number){
    switch(index){
      case 0: {
        this.location = [{lat: 52.5200066, lng: 13.404954, zoom: 10,placeId: 'ddd',  choose: false}];
        this.address = 'Берлин, Germany';
        break;
      };
      case 1: {
        this.location = [{lat: 47.497912, lng: 19.040235, zoom: 10,placeId: 'ddd',  choose: false}];
        this.address = 'Будапешт, Hungary';
        break;
      };
      case 2: {
        this.location = [{lat: 51.5073509, lng: -0.1277583, zoom: 10, placeId:'dddd',  choose: false}];
        this.address = 'Лондон, UK';
        break;
      };
      case 3: {
        this.location = [{lat: 59.9342802, lng: 30.3350986, zoom: 10, placeId:'dddd',  choose: false}];
        this.address = 'Санкт-Петербург, Russia';
        break;
      };
      case 4: {
        this.location = [{lat: 55.755826, lng: 37.6173, zoom: 10, placeId:'dddd',  choose: false}];
        this.address = 'Москва, Russia';
        break;
      };
      case 5: {
        this.location = [{lat: 48.856614, lng: 2.3522219, zoom: 10,placeId: 'dddd',  choose: false}];
        this.address = 'Париж, France';
        break;
      };
      default:
        break;
    }
    //this.data.changeLocation(this.location[0]);
    this.data.changeCityName(this.address);
    this.data.changeLocations(this.location);
  }
}
