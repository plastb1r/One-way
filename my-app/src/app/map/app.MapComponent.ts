import { Component, Input, ViewChild, NgZone,ElementRef, OnInit } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { Location } from 'src/app/domens/location';
import { Injectable } from '@angular/core';
import { Way } from 'src/app/domens/way';
import { PlaceDetails } from '../domens/placeDetails';


@Component({
  selector: 'map-form',
  templateUrl: './map.html',
  styleUrls: ['./app.mapComponent.scss']

})
@Injectable()
export class MapFormComponent implements OnInit{
  public locations2: Array<Location>;
  public details: Array<PlaceDetails>;
  public way: Way;
  private previous;

  public zoom: number = 12;
  public visibility: Array<boolean> = new Array<boolean>(); //for places in way


  @ViewChild('searchplace', {static: true})
  public searchElementRef: ElementRef;

   constructor(
     private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone
   ) { }

   ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {

    this.locations2 = JSON.parse(sessionStorage.getItem('locatsToShowOnMap'));
    this.details = JSON.parse(sessionStorage.getItem('detailsToShowOnMap'));

    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    });
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log(place.geometry.location.lat() + ' ' + place.geometry.location.lng());
          this.locations2 = [];
          this.locations2 = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(),placeId: place.place_id}];
          sessionStorage.removeItem('locatsToShowOnMap');
          sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations2));
          sessionStorage.removeItem('detailsToShowOnMap');
          this.details = [];
          var photo = [];
          photo.push(place.photos[0].getUrl({maxWidth: 400}));
          this.details.push({name: place.name, address: place.formatted_address, photos: photo,
          types: place.types});
          sessionStorage.setItem('detailsToShowOnMap', JSON.stringify(this.details));
        });
      });
   });
 }

 sendPlaceId(index){
  sessionStorage.removeItem('landmark');
  sessionStorage.setItem("landmark", this.locations2[index].placeId);
}
toggle(index: number){
  this.visibility[index] = !this.visibility[index];
}
  public markerClicked(infowindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infowindow;

  }
}
