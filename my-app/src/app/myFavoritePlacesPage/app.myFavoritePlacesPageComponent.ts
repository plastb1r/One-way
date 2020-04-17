import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import { User } from 'src/app/domens/user';
import { PlacesService } from '../services/places.service';
import { PlaceDetails } from '../domens/PlaceDetails';

@Component({
  templateUrl: './myFavoritePlacesPage.html',
  styleUrls: ['./app.myFavoritePlacesPageComponent.scss']

})
export class MyFavoritePlacesPageComponent{
  @ViewChild('map', {static: false})
  mapElement: ElementRef;

  places = [];

  map: any;
  placeDetails: Array<PlaceDetails> = new Array<PlaceDetails>();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private placeService:PlacesService
  ) { }

  ngOnInit() {
    this.placeService.getAll().subscribe(data => {
      this.places=data; 
      this.places.forEach(f => this.loadPlaces(f.placeId));
    });
  }

  sendPlaceId(index){
    sessionStorage.removeItem('landmark');
    sessionStorage.setItem("landmark", this.places[index].placeId);
  }  
  
  loadPlaces(placeid){
    console.log(placeid);
    this.mapsAPILoader.load().then(() => {
      let city = {lat: this.places[0].lat, lng:  this.places[0].lng};
      let mapOptions = {
        center: city,
        zoom: 15
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let service = new google.maps.places.PlacesService(this.map);

      var request = {
        placeId: placeid,
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'rating', 'international_phone_number', 'photos', 'types']
      };

      service.getDetails(request, (place, status) => {
          this.getPlaces(place, status)
      });

    }, (err) => {
      console.log(err);
    });

  }

  getPlaces(place, status){
    var photo = [];
    photo.push(place.photos[0].getUrl({maxWidth: 400}));
      this.placeDetails.push({name: place.name, address: place.formatted_address,photos:photo,
        types: place.types, rating: place.rating});
      console.log("details" + this.placeDetails[0].name);
    }

  /*deleteFav(i: number){
    this.user.favPlaces.splice(i, 1);
    console.log(this.user.favPlaces);
  }*/

}
