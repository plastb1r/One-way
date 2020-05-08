import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import { User } from 'src/app/domens/user';
import { RoutesService } from '../services/routes.service';

@Component({
  templateUrl: './myWaysPage.html',
  styleUrls: ['./app.myWaysPageComponent.scss']

})
export class MyWaysPageComponent implements OnInit{

  @ViewChild('map', {static: false})
  mapElement: ElementRef;

  map: any;
  photo: Array<string> = new Array<string>();
  myWays: Array<Way> = new Array<Way>();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private routeService:RoutesService
  ) { }

  ngOnInit() {
    this.routeService.getAll().subscribe(data => {
      this.myWays=data;
      console.log(this.myWays);
      this.myWays.forEach(p => this.loadPlaces(p.places[1].place));
    });
  }
    
  newLocation(i: number){
    sessionStorage.setItem("Way",JSON.stringify(this.myWays[i]));
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
        fields: ['photos']
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
    this.photo.push(results.photos[0].getUrl());
  }

  deleteWay(id){
    this.routeService.deleteById(id).subscribe(data => console.log(data));
    window.location.reload();
    }
}

