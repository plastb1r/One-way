import { Component, Input, ViewChild, NgZone,ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Location } from 'src/app/domens/location';
import {HomePageComponent} from 'src/app/homePage/app.homePageComponent';
import {DataService} from 'src/app/services/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpService} from 'src/app/services/http.service';
import { Way } from 'src/app/domens/way';
import { Data } from '../domens/data';
import { Direction } from 'src/app/domens/direction';
import { stringify } from 'querystring';
import { PlaceDetails } from '../domens/placeDetails';
import { PlaceOnRoute } from '../domens/placeOnRoute';
import { THIS_EXPR, IfStmt } from '@angular/compiler/src/output/output_ast';
import { NgForm } from '@angular/forms';
import { RoutesService } from '../services/routes.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'map-route-form',
  templateUrl: './routeOnMap.html',
  styleUrls: ['./app.routeOnMapComponent.scss']

})
@Injectable()
export class RouteOnMapComponent implements OnInit{
  public done: boolean = false;
  public locations: Array<Location>;
  public placesOnRoute: Array<PlaceOnRoute>;
  public way: Way;
  private _opened: boolean = true;
  label: Array<string> = new Array<string>();
  private cityLoc;

  public zoom: number = 12;
  private previous;
  private markersLabels = ['A','B','C','D','E','F','Z','H','I','K','L','M','N','O','P','Q','R','S','T','V','X'];
  private travelModesStr: Array<string> = new  Array<string>();

  private travelModes: Array<string> = new  Array<string>();
  private dirWalk: Array<Direction> = new Array<Direction>();
  private dirTrans: Array<Direction> = new Array<Direction>();
  private dirBic: Array<Direction> = new Array<Direction>();
  private dirCar: Array<Direction> = new Array<Direction>();
  private show: boolean = false;

  @ViewChild('map', {static: false})
  mapElement: ElementRef;

  map: any;
  service;
  routeCity;
  ind=-1;
  places:Array<Location> = new Array<Location>();
  details: Array<PlaceDetails> = new Array<PlaceDetails>();
  timeToNext:  Array<number> = new Array<number>();
  transportToNext:  Array<string> = new Array<string>();
  visibility: Array<boolean> = new Array<boolean>();
  travelModesIcons: Array<string> = new  Array<string>();
  icons = ["fa fa-car listing-contact__icon", "fa fa-bus listing-contact__icon", "fa fa-bicycle listing-contact__icon", "fa fa-male listing-contact__icon"];


  @ViewChild('searchplace', {static: true})
  public searchElementRef: ElementRef;

   constructor(
     private mapsAPILoader: MapsAPILoader,
     private routeService: RoutesService,
     private cd: ChangeDetectorRef
   ) { }

  ngOnInit() {
    this.cityLoc = JSON.parse(sessionStorage.getItem("cityAddressLocat"));
    this.placesOnRoute = JSON.parse(sessionStorage.getItem("placesFromRoute"));
    console.log("Точки от алгоритма", sessionStorage.getItem("placesFromRoute"));

    this.mapsAPILoader.load().then(() => {
      let city = {lat: 51.673727, lng: 39.21114};
      let mapOptions = {
      center: city,
      zoom: 15
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.service = new google.maps.places.PlacesService(this.map);
      this.placesOnRoute.forEach(p => {
        console.log("id точки, переданной в функцию", p.place);
        
        this.loadPlaces(p);
        this.timeToNext.push((Math.round(p.timeToNext/60)));
        this.travelModes.push(p.transportToNext);
      })
      }, (err) => {
          console.log(err);
    });

    
  }

    sendPlaceId(placeId){
        sessionStorage.removeItem('landmark');
        sessionStorage.setItem("landmark", placeId);
    }

    setDirections(){
      let lat: number;
      let lng: number;

      let nextlat: number;
      let nextlng: number;

      for(var i = 0; i < this.travelModes.length-1; i++){

        lat =  this.placesOnRoute[i]['lat'];
        lng =  this.placesOnRoute[i]['lng'];

        nextlat = this.placesOnRoute[i+1]['lat'];
        nextlng = this.placesOnRoute[i+1]['lng'];

        if(this.travelModes[i] == "walking")
        {
            var dir = {
              origin: {lat: lat, lng: lng},
              destination: {lat: nextlat, lng: nextlng},
            travelMode: google.maps.TravelMode.WALKING
            }
            this.dirWalk.push(dir);
            console.log(this.dirWalk);
        }
  
        if(this.travelModes[i] == "transit")
        {
          var dir = {
            origin: {lat: lat, lng: lng},
            destination: {lat: nextlat, lng: nextlng},
            travelMode: google.maps.TravelMode.TRANSIT
            }
            this.dirTrans.push(dir);
        }
        if(this.travelModes[i] == "driving")
        {
          var dir =  {
            origin: {lat: lat, lng: lng},
            destination: {lat: nextlat, lng: nextlng},
            travelMode: google.maps.TravelMode.DRIVING
            }
            this.dirCar.push(dir);
        }
        if(this.travelModes[i] == "bicycling")
        {
          var dir = {
            origin: {lat: lat, lng: lng},
            destination: {lat: nextlat, lng: nextlng},
            travelMode: google.maps.TravelMode.BICYCLING
            }
            this.dirBic.push(dir);
        }
      }

      setTimeout(() => {
        this.done = true;
        this.cd.detectChanges();
      }, 1000);
    }
    
    setTravelModes(){
      this.travelModes.forEach(tm => {
        if(tm == "walking")
        {
          this.travelModesIcons.push(this.icons[3]);
          this.travelModesStr.push("Пешком")
        }
        if(tm == "transit")
        {
          this.travelModesIcons.push(this.icons[1]);
          this.travelModesStr.push("Транзит")
        }
        if(tm == "driving")
        {
          this.travelModesIcons.push(this.icons[0]);
          this.travelModesStr.push("На машине")
        }
        if(tm == "bicycling")
        {
          this.travelModesIcons.push(this.icons[2]);
          this.travelModesStr.push("На велосипеде")
        }
      })
    }

    loadPlaces(p){
      var request = {
      placeId: p.place,
      fields: ['name', 'formatted_address',  'photos', "place_id", "geometry", "address_components"]
      };

      this.service.getDetails(request, (place, status) => {
          this.getPlaces(place, status, p);
      });
    }
  
    getPlaces(results, status,p) {
      var photo = [];
      if(results.photos != null){
        photo.push(results.photos[0].getUrl());
      }
      else{
        photo.push("/assets/img/place.jpeg");
      }
      console.log("точка, пришедшая в функцию", results.place_id);
      p['name'] = results.name;
      p['address'] = results.formatted_address;
      p['photo'] = photo;
      p['lat'] = results.geometry.location.lat();
      p['lng'] = results.geometry.location.lng();
      //p['label'] = this.markersLabels[this.ind+=1];
      console.log(this.placesOnRoute);
      //this.details.push({name: results.name, address: results.formatted_address, photos: photo});
      this.places.push({lat: results.geometry.location.lat(), lng: results.geometry.location.lng(),placeId: results.place_id});
      if (this.places.length == this.placesOnRoute.length){
        this.setTravelModes();
        this.setDirections();
      }
      //this.label.push(this.markersLabels[this.ind+=1]);
    }


    toggle(index: number){
        this.visibility[index] = !this.visibility[index];
    }

    saveWay(form: NgForm){
      let name = form.controls['name'].value;
      this.placesOnRoute.forEach(p => {
        p.timeToNext = (p.timeToNext);
      })
      let way: Way = new Way(name, this.placesOnRoute[this.placesOnRoute.length -1].timeToNext, 
        this.placesOnRoute, sessionStorage.getItem("cityAddress"));
      this.routeService.addWay(way).subscribe(data => console.log(data));
    }

    public markerClicked(infowindow) {
      if (this.previous) {
          this.previous.close();
      }
      this.previous = infowindow;
    }
    
    public _toggleOpened(): void {
        this._opened = !this._opened;
    }


    public renderOptionsWalk: any = {
        draggable: false,
        suppressMarkers: true,
        suppressInfoWindows: false,
        markerOptions: { // effect all markers
        },
        polylineOptions: { strokeColor: '#0D632F' }
      }
    
      public renderOptionsTrans: any = {
        draggable: false,
        suppressMarkers: true,
        suppressInfoWindows: false,
        markerOptions: { // effect all markers
        },
        polylineOptions: { strokeColor: '#632A0D' }
      }
  
      public renderOptionsCar: any = {
        draggable: false,
        suppressMarkers: true,
        suppressInfoWindows: false,
        markerOptions: { // effect all markers
        },
        polylineOptions: { strokeColor: '#F79430' }
      }
  
      public renderOptionsBic: any = {
        draggable: false,
        suppressMarkers: true,
        suppressInfoWindows: false,
        markerOptions: { // effect all markers
        },
        polylineOptions: { strokeColor: '#0D632F' }
      }
}
