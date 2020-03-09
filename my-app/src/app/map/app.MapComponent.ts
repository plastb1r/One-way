import { Component, Input, ViewChild, NgZone,ElementRef, OnInit } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Location } from 'src/app/domens/location';
import {HomePageComponent} from 'src/app/homePage/app.homePageComponent';
import {DataService} from 'src/app/services/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpService} from 'src/app/services/http.service';
import { Way } from 'src/app/domens/way';

@Component({
  selector: 'map-form',
  templateUrl: './map.html',
  styleUrls: ['./app.mapComponent.scss']

})
@Injectable()
export class MapFormComponent implements OnInit{
  public locations2: Array<Location>;
  private geoCoder;
  private _opened: boolean = false;
  index: number;
  rating: number;
  zoom: number = 12;
  address: string;
  photo: string;
  photos:  Array<string>;
  name: string;
  previous;
  number: string;
  types: Array<string>;
  loc: Location;
  showIndexes: boolean = false;
  placeId: string;
  dir = undefined;
  allow = true;
  way: Way;
  notallow = false;
  locations = [ [
      {lat:51.6723005, lng:39.2089039, zoom: 15,placeId: 'fff',  choose: false},
      {lat:51.672590, lng:39.2085639, zoom: 15,placeId:  'fff',  choose: false},
      {lat:51.6698819, lng:39.2121903, zoom: 15,placeId:  'fff',  choose: false},
      {lat:51.6680339, lng:39.1857196, zoom: 15, placeId: 'fff',  choose: false}
    ],
    [
      {lat:54.6723005, lng:39.2089039, zoom: 15, placeId: 'fff',  choose: false},
      {lat:54.672590, lng:39.2089039, zoom: 15, placeId: 'fff',  choose: false},
      {lat:54.6698819, lng:39.2121903, zoom: 15,placeId:  'fff',  choose: false},
      {lat:54.6680339, lng:39.1857196, zoom: 15, placeId: 'fff',  choose: false}
    ],
    [
      {lat:57.6723005, lng:39.2089039, zoom: 15, placeId: 'fff',  choose: false},
      {lat:57.672590, lng:39.2085639, zoom: 15, placeId: 'fff',  choose: false},
      {lat:57.6698819, lng:39.2121903, zoom: 15,  placeId:'fff',  choose: false},
      {lat:57.6680339, lng:39.1857196, zoom: 15, placeId:'fff',  choose: false}
    ]
  ]

  @ViewChild('searchplace', {static: true})
  public searchElementRef: ElementRef;

   constructor(
     private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone,
     private data: DataService,
     private http: HttpClient,
     private httpService: HttpService
   ) { }

   createWay(){
    this.allow = false;
    this.notallow = true;
    //this.data.currentWay.subscribe(w => this.way = w);
    this.locations2 = this.way.points;
    var length = this.locations2.length - 1;
    var directs = [];
    for(var i = 1; i < this.locations2.length - 1; i++){
      var d = {location: {lat: this.locations2[i].lat, lng: this.locations2[i].lng}};
      directs.push(d);
    }
    console.log(this.locations2);
    console.log(directs);
    this.dir = {
      origin: {lat: this.locations2[0].lat, lng:this.locations2[0].lng},
      destination: {lat: this.locations2[length].lat, lng: this.locations2[length].lng},
      waypoints: directs,
      travelMode: google.maps.TravelMode.DRIVING
    }

    /*this.mapsAPILoader.load().then(() => {
     var directionsService = new google.maps.DirectionsService();
     var directionsRenderer = new google.maps.DirectionsRenderer();
     directionsService.route({
        origin: {lat: this.locations2[0].lat, lng:this.locations2[0].lng},
        destination: {lat: this.locations2[1].lat, lng: this.locations2[1].lng},
        travelMode: google.maps.TravelMode.WALKING
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            console.log('good');
        } else {
            console.log('Directions request failed due to ' + status);
        }
    });
  });*/
   }

   ngOnInit() {
     //load Places Autocomplete
     this.data.currentWay.subscribe(w => this.way = w);
     this.mapsAPILoader.load().then(() => {
       //this.setCurrentLocation();
       //this.data.currentLoc.subscribe(locat => this.loc=locat);
       //this.locations2 = [
         //{lat: this.loc.lat, lng: this.loc.lng, zoom: 12}
      //];
      this.data.currentLocations.subscribe(locat => this.locations2 = locat);
      //this.data.currentBound.subscribe(bd => this.bound);
       this.geoCoder = new google.maps.Geocoder;
       //let autocomplete = new google.maps.places.Autocomplete("New York, NY, USA", {
       let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {

       });
       autocomplete.addListener("place_changed", () => {
         this.ngZone.run(() => {
           //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
           //verify result
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }
           //set latitude, longitude and zoom
           this.locations2 = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: this.zoom, placeId: place.place_id,choose: false}];
           this.placeId = place.place_id;
           //this.getDetails(this.placeId);
           //this.loc = {lat:place.geometry.location.lat(),lng: place.geometry.location.lng(), zoom: 15};
         });
       });
      });
   }

   getAddress(latitude: number, longitude: number) {
     this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
       if (status === 'OK') {
         if (results[0]) {
           /*for(var i=0; i<this.locations2.length; i++){
             if (this.locations2[i]['lat'] == results[0]['location']['lat']  &&  this.locations2[i].lng == results[0]['location']['lng'] )
             {
               console.log(this.locations2[i].placeId);*/
               this.placeId = results[0]['place_id'];
               console.log(this.placeId);
             /*}
           }*/
         } else {
           window.alert('No results found');
         }
       } else {
         window.alert('Geocoder failed due to: ' + status);
       }

     });
   }


  /*markerDragEnd($event: MouseEvent) {
   console.log($event);
   this.locations2.push({lat: $event.coords.lat,lng: $event.coords.lng, zoom: this.zoom, });
   this.getAddress($event.coords.lat, $event.coords.lng);
  }

  mapDoubleClick(event) {
    console.log(event);
    this.locations2.push({lat: event.coords.lat, lng:event.coords.lng, zoom: this.zoom});
  }*/

  public getDetails(placeId: string){
  this.httpService.getData(placeId).subscribe( value =>{
      this.name = value['result']['name'];
      this.address = value['result']['formatted_address'];
      this.rating = value['result']['rating'];
      this.types = value['result']['types'];
      this.number = value['result']['international_phone_number'];
      this.loc = {lat:value['result']['geometry']['location']['lat'],lng: value['result']['geometry']['location']['lng'], zoom: 15, placeId: value['result']['place_id'],  choose: false};
      var phot = value['result']['photos'];
      var ref = []
      phot.forEach(ph => {
        ref.push(ph['photo_reference']);
      });

      var photoRes = [];
        ref.forEach(ph => {
          photoRes.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+ph+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ')
        });
      this.photos = photoRes;
      //console.log(value['result']['place_id']);
      this.photo = this.photos[0];
    });
  }

  markerClicked(infowindow, iy: number) {
    this.placeId = this.locations2[iy].placeId;
    console.log(this.placeId);
    //this.choose = true;
    //this.getAddress(event.coords.lat, event.coords.lng);*/
    this.getDetails(this.placeId);
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infowindow;

  }

  _wayOpen(){
    this.locations2 = this.locations[this.index];
  }

  _toggleOpened(): void {
    this._opened = !this._opened;
  }

  setNumber(index){
      switch(index){
        case 0:
          this.index = 0;
          break;
        case 1:
          this.index = 1;
          break;
        case 2:
          this.index = 2

    }
    this.showIndexes = true;
    this._wayOpen();
  }

  public newLocation(){
   this.data.changeLandMark(this.loc);
   this.data.changePhotos(this.photos);
   this.data.changeRating(this.rating);
   this.data.changeAddress(this.address);
   this.data.changeName(this.name);
   this.data.changeNumber(this.number);
   this.data.changeTypes(this.types);
  }

  setLabel(index){
    var label: string = '';
    if(this.locations2.length > 1 && this.showIndexes == true){
        label = String(index + 1);
    }
    return label;
  }


  // Get Current Location Coordinates

}
