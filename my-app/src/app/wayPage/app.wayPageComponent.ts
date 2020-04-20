import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import { Way } from 'src/app/domens/way';
import { HttpClient } from '@angular/common/http';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { PlaceDetails } from '../domens/placeDetails';
import { IfStmt } from '@angular/compiler';
import { PlacesService } from '../services/places.service';

@Component({
  templateUrl: './wayPage.html',
  styleUrls: ['./app.wayPageComponent.scss']

})
export class WayPageComponent{
  @ViewChild('map', {static: false})
  mapElement: ElementRef;

  map: any;
  places:Array<Location> = new Array<Location>();
  details: Array<PlaceDetails> = new Array<PlaceDetails>();
  timeToNext:  Array<number> = new Array<number>();
  transportToNext:  Array<string> = new Array<string>();
  visibility: Array<boolean> = new Array<boolean>();
  travelModesIcons: Array<string> = new  Array<string>();
  icons = ["fa fa-car listing-contact__icon", "fa fa-bus listing-contact__icon", "fa fa-bicycle listing-contact__icon", "fa fa-male listing-contact__icon"];
  way: Way;
  label: string = '';
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private placeService: PlacesService
  ) { }


  ngOnInit() {
    this.way = JSON.parse(sessionStorage.getItem("Way"));
    this.way.places.forEach(p => {
      this.loadPlaces(p.place);
      this.timeToNext.push(p.timeToNext);
      this.transportToNext.push(p.transportToNext);
    }
    );
    this.setLastPlacesInArrays();
    this.setTravelModes();
  }

  setLastPlacesInArrays(){
    this.timeToNext.splice(this.timeToNext.length-1,1);
    this.timeToNext.push(this.way.timeToGo);
    this.transportToNext.splice(this.transportToNext.length-1,1);
    this.transportToNext.push("Маршрут окончен");
    this.label = 'Весь маршрут занял ';
  }

  sendPlaceId(index){
    sessionStorage.removeItem('landmark');
    sessionStorage.setItem("landmark", this.way.places[index].place);
  }

  addToFavP(index){
    var loc = {lat: this.places[index].lat, lng: this.places[index].lng, placeId: this.way.places[index].place};
    this.placeService.addPlace(loc).subscribe(data =>console.log(data));
  }

  loadPlaces(placeId){
    this.mapsAPILoader.load().then(() => {
      let city = {lat: 51.673727, lng: 39.21114};
      let mapOptions = {
        center: city,
        zoom: 15
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let service = new google.maps.places.PlacesService(this.map);


      var request = {
        placeId: placeId,
        fields: ['name', 'formatted_address',  'photos', "place_id", "geometry"]
      };

      service.getDetails(request, (place, status) => {
          this.getPlaces(place, status)
      });

    }, (err) => {
      console.log(err);
    });

  }

  getPlaces(results, status){
    console.log("place"+results.photos);
    var photo = [];
    photo.push(results.photos[0].getUrl());
    this.details.push({name: results.name, address: results.formatted_address, photos: photo});
    this.places.push({lat: results.geometry.location.lat(), lng: results.geometry.location.lng(),placeId: results.place_id});
  }

  public setTravelModes(){
    this.transportToNext.forEach(tm => {
      if(tm == "walking")
      {
        this.travelModesIcons.push(this.icons[3]);
      }
      if(tm == "transit")
      {
        this.travelModesIcons.push(this.icons[1]);
      }
      if(tm == "driving")
      {
        this.travelModesIcons.push(this.icons[0]);
      }
      if(tm == "bycycle")
      {
        this.travelModesIcons.push(this.icons[2]);
      }
    })
  }
}
