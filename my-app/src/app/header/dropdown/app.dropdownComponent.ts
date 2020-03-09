import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';

@Component({
  selector: 'dropdown',
  templateUrl: './app.dropdownComponent.html'
})
export class DropDownComponent {
  private geoCoder;
  location: Array<Location>;

  @ViewChild('searche', {static: false})
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
        this.location = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: 12, placeId: place.place_id, choose: false}];

        });
      });
    });
  }

  _newLocation(){
  this.data.changeLocations(this.location);
  }
}
