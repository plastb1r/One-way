import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'dropdown',
  templateUrl: './app.dropdownComponent.html',
  styleUrls: ['./app.dropdownComponent.scss']
})
export class DropDownComponent {
  private geoCoder;
  location: Array<Location>;
  address: string ='';

  @ViewChild('searche', {static: false})
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private data: DataService,
    private triggerService: TriggerService
  ) { }


  ngOnInit() {
    //load Places Autocomplete

    this.mapsAPILoader.load().then(() => {
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
        this.address = place.formatted_address;
        this.location = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), placeId: place.place_id}];
        this.changeCity();
        });
      });
    });
  }

  changeCity(){
    sessionStorage.removeItem('cityAddress');
    sessionStorage.setItem('cityAddress', this.address);
    sessionStorage.removeItem('cityAddressLocat');
    sessionStorage.setItem('cityAddressLocat', JSON.stringify(this.location));
    this.triggerService.triggerOnMyButton();
  }
}
