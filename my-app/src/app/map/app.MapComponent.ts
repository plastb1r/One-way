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
import { Data } from '../domens/data';

@Component({
  selector: 'map-form',
  templateUrl: './map.html',
  styleUrls: ['./app.mapComponent.scss']

})
@Injectable()
export class MapFormComponent implements OnInit{
  public locations2: Array<Location>;
  dataw: Array<Data> = new Array<Data>();
  private geoCoder;
  private _opened: boolean = false;
  index: number;
  indexw: number = -1;
  rating: number;
  zoom: number = 12;
  address: string;
  photo: string;
  photos:  Array<string>;
  name: string;
  typesw:  Array<any> = new Array<any>();
  numberw: Array<string> = new Array<string>();
  ratingw: Array<number> = new Array<number>();
  photosw: Array<Array<string>> = new Array<Array<string>>();
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
  visibility: Array<boolean> = new Array<boolean>();
  visibilityOfPopularplaces : boolean;
  markersLabels = ['A','B','C','D','E','F','Z','H','I','K','L','M','N','O','P','Q','R','S','T','V','X'];

  @ViewChild('searchplace', {static: true})
  public searchElementRef: ElementRef;

   constructor(
     private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone,
     private data: DataService,
     private http: HttpClient,
     private httpService: HttpService
   ) { }

   // sends places to alg 
   placesFromAlg(){
    this.way.points.forEach(w =>{
      console.log("before alg " + w.lat);
    });
    this.httpService.sendPlacesToAlgorythm(this.way.points).subscribe(
      (data: Array<Location>) => {
        this.way.points=data;
      }
    );
    this.way.points.forEach(w =>{
      console.log("after alg " + w.lat);
    });
    this.data.changeWay1(this.way);
    this.createWay(this.way.points);

   }

   toggle(index: number){
    this.visibility[index] = !this.visibility[index];
  }

   createWay(arr: Array<Location>){
    this.visibilityOfPopularplaces = false;
    this.data.changeVisibilityOfMap(false);
    this.dataw =  new Array<Data>();
    this.typesw = new Array<any>();
    this.numberw = new Array<string>();
    this.ratingw = new Array<number>();
    this.photosw = new Array<Array<string>>();
    arr.forEach(w =>{
      console.log("func  " + w.lat);
    });
    
    arr.forEach(p => {
      this.getDetailsForWay(p.placeId);
    });
    this.allow = false;
    this.notallow = true;
    var length = arr.length - 1;
    var directs = [];
    for(var i = 1; i < arr.length - 1; i++){
      var d = {location: {lat: arr[i].lat, lng: arr[i].lng}, stopover: false,};
      directs.push(d);
    }
    console.log(arr);
    console.log(directs);
    this.dir = {
      origin: {lat: arr[0].lat, lng:arr[0].lng},
      destination: {lat: arr[length].lat, lng: arr[length].lng},
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

  

   public getDetailsForWay(placeId: string){
    this.httpService.getData(placeId).subscribe( value =>{
      //var loc = {lat:value['result']['geometry']['location']['lat'],lng: value['result']['geometry']['location']['lng'], zoom: 15, placeId: value['result']['place_id'],  choose: false};
      var phot = value['result']['photos'];
      var name = value['result']['name'];
      var address = value['result']['formatted_address'];
      var rating = value['result']['rating'];
      var types = value['result']['types'];
      var number = value['result']['international_phone_number'];

      this.indexw += 1;
      var ref = []
      phot.forEach(ph => {
        ref.push(ph['photo_reference']);
      });

      var photoRes = [];
        ref.forEach(ph => {
          photoRes.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+ph+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ')
        });
      //console.log(value['result']['place_id']);
      this.dataw.push({photo: photoRes[0],name: name,address: address,index: this.indexw, isAddedToWay: true, isAddedToFav: true});
      console.log("data w" + this.dataw);
      this.photosw.push(photoRes);
      this.numberw.push(number);
      this.ratingw.push(rating);
      this.typesw.push(types);
    });
  }

  

   ngOnInit() {
     //load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
       //this.setCurrentLocation();
       //this.data.currentLoc.subscribe(locat => this.loc=locat);
       //this.locations2 = [
         //{lat: this.loc.lat, lng: this.loc.lng, zoom: 12}
      //];
      this.data.currentVisibilityOfMap.subscribe(vis => this.visibilityOfPopularplaces = vis);
      this.data.currentWay.subscribe(w => this.way = w);
      this.data.currentLocations.subscribe(locat => this.locations2 = locat);
      if(!this.visibilityOfPopularplaces){
        this.createWay(this.way.points);  
      }
      //this.data.currentBound.subscribe(bd => this.bound);
       this.geoCoder = new google.maps.Geocoder;
       //let autocomplete = new google.maps.places.Autocomplete("New York, NY, USA", {
       let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        
       });
       autocomplete.addListener("place_changed", () => {
         this.ngZone.run(() => {
           //get the place result
          let place:  google.maps.places.PlaceResult = autocomplete.getPlace();
           //verify result
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }

           //set latitude, longitude and zoom
           this.locations2 = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: this.zoom, placeId: place.place_id,choose: false}];
           this.placeId = place.place_id;
           this.data.changeLocations(this.locations2);
           this.visibilityOfPopularplaces = true; //make true visibility when return to a point after way
           this.data.changeVisibilityOfMap(true);
         });
       });
      });
   }

   /*getAddress(latitude: number, longitude: number) {
     this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
       if (status === 'OK') {
         if (results[0]) {
           /*for(var i=0; i<this.locations2.length; i++){
             if (this.locations2[i]['lat'] == results[0]['location']['lat']  &&  this.locations2[i].lng == results[0]['location']['lng'] )
             {
               console.log(this.locations2[i].placeId);
               this.placeId = results[0]['place_id'];
               console.log(this.placeId);
             /*}
             }
         } else {
           window.alert('No results found');
         }
       } else {
         window.alert('Geocoder failed due to: ' + status);
       }

     });
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

  _toggleOpened(): void {
    this._opened = !this._opened;
  }

  public newLocation(loc: Location, photos: Array<string>, rating: number, address: string, name: string, number: string, types: Array<string>){
   this.data.changeLandMark(loc);
   this.data.changePhotos(photos);
   this.data.changeRating(rating);
   this.data.changeAddress(address);
   this.data.changeName(name);
   this.data.changeNumber(number);
   this.data.changeTypes(types);
  }

  setLabel(index){
    var label: string = '';
        label =this.markersLabels[index];
    return label;
  }
  public renderOptions: any = {
    draggable: false,
    suppressMarkers: true,
    suppressInfoWindows: false,
    markerOptions: { // effect all markers
    },
}

}
