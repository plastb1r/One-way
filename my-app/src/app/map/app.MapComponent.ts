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
import { Direction } from 'src/app/domens/direction';
import { stringify } from 'querystring';
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
  private _opened: boolean = false;

  public zoom: number = 12;
  private previous;
  private markersLabels = ['A','B','C','D','E','F','Z','H','I','K','L','M','N','O','P','Q','R','S','T','V','X'];
  public visibilityOfPopularplaces : boolean;
  public visibility: Array<boolean> = new Array<boolean>(); //for places in way
  private icons = ["fa fa-car listing-contact__icon", "fa fa-bus listing-contact__icon", "fa fa-bicycle listing-contact__icon", "fa fa-male listing-contact__icon"];
  private travelModesStr: Array<string> = new  Array<string>();
  private travelModesIcons: Array<string> = new  Array<string>();
  private timeToNext: Array<number> = new Array<number>();
  private travelModes: Array<string> = new  Array<string>();
  private dirWalk: Array<Direction> = new Array<Direction>();
  private dirTrans: Array<Direction> = new Array<Direction>();
  private dirBic: Array<Direction> = new Array<Direction>();
  private dirCar: Array<Direction> = new Array<Direction>();
  private show: boolean = false;


  @ViewChild('searchplace', {static: true})
  public searchElementRef: ElementRef;

   constructor(
     private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone,
     private data: DataService,
     private httpService: HttpService
   ) { }

   ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
     this.data.currentVisibilityOfMap.subscribe(vis => this.visibilityOfPopularplaces = vis);
     //this.data.currentWay.subscribe(w => this.way = w);
     this.visibilityOfPopularplaces = true;
     this.locations2 = JSON.parse(sessionStorage.getItem('locatsToShowOnMap'));
     this.details = JSON.parse(sessionStorage.getItem('detailsToShowOnMap'));

    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    });
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        let place:  google.maps.places.PlaceResult = autocomplete.getPlace();
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

  /* loadPlaces(){
    this.mapsAPILoader.load().then(() => {
      let city = {lat: this.cityLocation[0].lat, lng:  this.cityLocation[0].lng};
      let mapOptions = {
        center: city,
        zoom: 15
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let service = new google.maps.places.PlacesService(this.map);

      var request = {
        placeId: this.placeId,
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'rating', 'international_phone_number', 'photos', 'types']
      };

      service.getDetails(request, (place, status) => {
          console.log(place.geometry.location.lat())
          this.getPlaces(place, status)
      });

    }, (err) => {
      console.log(err);
    });

  }

  getPlaces(results, status){
      console.log("place"+results.photos);
      this.name = results.name;
      this.rating = results.rating;
      this.types = results.types;
      this.number = results.international_phone_number;
      this.address = results.formatted_address;
      this.lat = results.geometry.location.lat;
      this.lng = results.geometry.location.lng;
      for (var i = 0; i < results.photos.length ; i++) {
        this.photo.push(results.photos[i].getUrl());
      }
      this.lat = results.geometry.location.lat();
      this.lng = results.geometry.location.lng();
      //this.placeDetails.push({name: results.name, address: results.formatted_address,photos:results.photos,
        //types: results.types});
      //console.log("details" + this.placeDetails[0].name);
    }

   public placesFromAlg(){
    this.timeToNext = new Array<number>();
    this.travelModes =  new  Array<string>();
    this.travelModesStr = new Array<string>();
    console.log("1  s   " + this.way.points[0].lat);
    console.log("2  s   " + this.way.points[1].lat);
    console.log("3  s  " + this.way.points[2].lat);
    var d = [];
    var tm =  new Array<string>();
    this.httpService.sendPlacesToAlgorythm(this.way.points).subscribe(
      (data: Array<any>) => {
        d = data;
        this.way.points = new Array<Location>();
        d.forEach(p => {
          this.way.points.push(p['place']);
          this.timeToNext.push((Math.round(p['timeToNext']/60)));
          this.travelModes.push(p['transportToNext']);
        });
        console.log("1     " + this.way.points[0].lat);
        console.log("2     " + this.way.points[1].lat);
        console.log("3     " + this.way.points[2].lat);


        console.log("1     " + this.timeToNext[0]);
        console.log("2     " + this.timeToNext[1]);
        console.log("3     " + this.timeToNext[2]);

        console.log("1     " + this.travelModes[0]);
        console.log("2     " + this.travelModes[1]);
        console.log("3     " + this.travelModes[2]);

        this.setTravelModes();
        this.show = true;
        //this.createWay(this.way.points);
        console.log("1     " + this.travelModesStr[0]);
        console.log("2     " + this.travelModesStr[1]);
        console.log("3     " + this.travelModesStr[2]);

      }

    )
    if(this.show){
      this.createWay(this.way.points);
      this.data.changeWay1(this.way);
      this.visibilityOfPopularplaces = false;
    }
  }
    
    public createWay(arr: Array<Location>){
      /*arr.forEach(p => {
        this.getDetailsForWay(p.placeId);
      });
      this.travelModes = ["walking", "transit", "driving", "walking", "transit", "driving"];
      for(var i = 0; i < arr.length - 1; i++){
        if(this.travelModes[i] == "walking")
        {
            var dir = {
            origin: {lat: arr[i].lat, lng: arr[i].lng},
            destination: {lat: arr[i+1].lat, lng: arr[i+1].lng},
            travelMode: google.maps.TravelMode.WALKING
            }
            this.dirWalk.push(dir);
        }
  
  
        if(this.travelModesStr[i] == "transit")
        {
          var dir = {
            origin: {lat: arr[i].lat, lng: arr[i].lng},
            destination: {lat: arr[i+1].lat, lng: arr[i+1].lng},
            travelMode: google.maps.TravelMode.WALKING
            }
            this.dirTrans.push(dir);
        }
        if(this.travelModesStr[i] == "driving")
        {
          var dir =  {
            origin: {lat: arr[i].lat, lng: arr[i].lng},
            destination: {lat: arr[i+1].lat, lng: arr[i+1].lng},
            travelMode: google.maps.TravelMode.DRIVING
            }
            this.dirCar.push(dir);
        }
        if(this.travelModesStr[i] == "bicycling")
        {
          var dir = {
            origin: {lat: arr[i].lat, lng: arr[i].lng},
            destination: {lat: arr[i+1].lat, lng: arr[i+1].lng},
            travelMode: google.maps.TravelMode.BICYCLING
            }
            this.dirBic.push(dir);
        }
      }
      this.visibilityOfPopularplaces = false;
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

   toggle(index: number){
    this.visibility[index] = !this.visibility[index];
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

     public makeVis(){
      this.visibilityOfPopularplaces = false;
      this.data.changeVisibilityOfMap(false);
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
  

     public setLabel(index){
      var label: string = '';
          label =this.markersLabels[index];
      return label;
    }*/
}
