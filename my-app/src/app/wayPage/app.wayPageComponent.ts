import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import { Way } from 'src/app/domens/way';
import { HttpClient } from '@angular/common/http';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { PlaceDetails } from '../domens/placeDetails';
import { IfStmt, ConditionalExpr } from '@angular/compiler';
import { PlacesService } from '../services/places.service';
import { RoutesService } from '../services/routes.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './wayPage.html',
  styleUrls: ['./app.wayPageComponent.scss']

})
export class WayPageComponent{
  @ViewChild('map', {static: false})
  mapElement: ElementRef;

  map: any;
  //places:Array<Location> = new Array<Location>();
  //details: Array<PlaceDetails> = new Array<PlaceDetails>();
  timeToNext:  Array<number> = new Array<number>();
  transportToNext:  Array<string> = new Array<string>();
  visibility: Array<boolean> = new Array<boolean>();
  travelModesIcons: Array<string> = new  Array<string>();
  icons = ["fa fa-car listing-contact__icon", "fa fa-bus listing-contact__icon", "fa fa-bicycle listing-contact__icon", "fa fa-male listing-contact__icon"];
  way: Way;
  label:Array<string> = new Array<string>();
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private placeService: PlacesService,
    private routeService: RoutesService,
    private router: Router
  ) { }


  ngOnInit() {
    this.way = JSON.parse(sessionStorage.getItem("Way"));
    this.way.places.forEach(p => {
      this.loadPlaces(p);
      this.timeToNext.push(Math.round(p.timeToNext/60));
      this.transportToNext.push(p.transportToNext);
      this.label.push('');
    }
    );
    this.setLastPlacesInArrays();
    this.setTravelModes();
  }

  setLastPlacesInArrays(){
    this.timeToNext.splice(this.timeToNext.length-1,1);
    this.timeToNext.push(Math.round(this.way.timeToGo/60));
    this.transportToNext.splice(this.transportToNext.length-1,1);
    this.transportToNext.push("Маршрут окончен");
    this.label.splice(this.label.length-1,1);
    this.label.push('Весь маршрут занял ');
  }

  sendPlaceId(index){
    sessionStorage.removeItem('landmark');
    sessionStorage.setItem("landmark", this.way.places[index].place);
  }

  addToFavP(index){
    let lat: number = this.way.places[index]['lat'];
    let lng: number = this.way.places[index]['lng'];

    var loc = {lat: lat, lng: lng, placeId: this.way.places[index].place};
    this.placeService.addPlace(loc).subscribe(data =>console.log(data));
  }

  loadPlaces(p){
    this.mapsAPILoader.load().then(() => {
      let city = {lat: 51.673727, lng: 39.21114};
      let mapOptions = {
        center: city,
        zoom: 15
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let service = new google.maps.places.PlacesService(this.map);


      var request = {
        placeId: p.place,
        fields: ['name', 'formatted_address',  'photos', "place_id", "geometry"]
      };

      service.getDetails(request, (place, status) => {
          this.getPlaces(place, status, p)
      });

    }, (err) => {
      console.log(err);
    });

  }

  getPlaces(results, status, p){
    console.log("place"+results.photos);
    var photo = [];
    if(results.photos != null){
      photo.push(results.photos[0].getUrl());
    }
    else{
      photo.push("/assets/img/place.jpeg");
    }

    p['name'] = results.name;
    p['address'] = results.formatted_address;
    p['photo'] = photo;
    p['lat'] = results.geometry.location.lat();
    p['lng'] = results.geometry.location.lng();

    //this.details.push({name: results.name, address: results.formatted_address, photos: photo});
    //this.places.push({lat: results.geometry.location.lat(), lng: results.geometry.location.lng(),placeId: results.place_id});
  }

  showWay(){
    sessionStorage.setItem("placesFromRoute", JSON.stringify(this.way.places));
    this.router.navigate(['/mapRoutePage']);
  }

  deleteWay(id){
    this.routeService.deleteById(id).subscribe(error => {
      console.log(error)
      this.router.navigate(['/myWaysPage']);});
   
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
