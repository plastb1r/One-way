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
import { Direction } from 'src/app/domens/placesOnRoute';
import { stringify } from 'querystring';

@Component({
  selector: 'map-form',
  templateUrl: './map.html',
  styleUrls: ['./app.mapComponent.scss']

})
@Injectable()
export class MapFormComponent implements OnInit{
  public locations2: Array<Location>;
  private geoCoder;
  public way: Way;
  private _opened: boolean = false;
  private index: number;
  private rating: number;
  public zoom: number = 12;
  private address: string;
  private photo: string;
  private photos:  Array<string>;
  private name: string;
  private previous;
  private number: string;
  private types: Array<string>;
  private loc: Location;
  private placeId: string;
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
  private dataw: Array<Data> = new Array<Data>();
  private typesw:  Array<any> = new Array<any>();
  private numberw: Array<string> = new Array<string>();
  private ratingw: Array<number> = new Array<number>();
  private photosw: Array<Array<string>> = new Array<Array<string>>();
  private indexw: number = -1;
  private show: boolean = false;


  @ViewChild('searchplace', {static: true})
  public searchElementRef: ElementRef;

   constructor(
     private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone,
     private data: DataService,
     private http: HttpClient,
     private httpService: HttpService
   ) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.data.currentVisibilityOfMap.subscribe(v => this.visibilityOfPopularplaces = v);
      this.data.currentWay.subscribe(w => this.way = w);
      this.data.currentLocations.subscribe(locat => this.locations2 = locat);
      this.geoCoder = new google.maps.Geocoder;
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
          let place:  google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.locations2 = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: this.zoom, placeId: place.place_id,choose: false}];
            this.placeId = place.place_id;
            this.data.changeLocations(this.locations2);
          });
        });
    });
  }

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
      this.photo = this.photos[0];
    });
    }

    public markerClicked(infowindow, iy: number) {
      this.placeId = this.locations2[iy].placeId;
      console.log(this.placeId);
      this.getDetails(this.placeId);
      if (this.previous) {
          this.previous.close();
      }
      this.previous = infowindow;
  
    }
  
    public _toggleOpened(): void {
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

    public setTravelModes(){
      this.travelModes.forEach(tm => {
        if(tm == "WALKING")
        {
          this.travelModesIcons.push(this.icons[3]);
          this.travelModesStr.push("Пешком")
        }
        if(tm == "TRANSIT")
        {
          this.travelModesIcons.push(this.icons[1]);
          this.travelModesStr.push("Транзит")
        }
        if(tm == "DRIVING")
        {
          this.travelModesIcons.push(this.icons[0]);
          this.travelModesStr.push("На машине")
        }
        if(tm == "BICYCLING")
        {
          this.travelModesIcons.push(this.icons[2]);
          this.travelModesStr.push("На велосипеде")
        }
      })
     }
  
    public toggle(index: number){
      this.visibility[index] = !this.visibility[index];
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
          this.travelModes = ["WALKING", "TRANSIT", "DRIVING", "WALKING", "TRANSIT", "DRIVING"];
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
          this.createWay(this.way.points);
          this.data.changeWay1(this.way);
          this.visibilityOfPopularplaces = false;
          //this.show = true;
          //this.createWay(this.way.points);
          console.log("1     " + this.travelModesStr[0]);
          console.log("2     " + this.travelModesStr[1]);
          console.log("3     " + this.travelModesStr[2]);
  
        }
  
      );
      /*if(this.show){
        this.createWay(this.way.points);
        this.data.changeWay1(this.way);
        this.visibilityOfPopularplaces = false;
      }*/

      this.createWay(this.way.points);
      this.data.changeWay1(this.way);
      this.visibilityOfPopularplaces = false;
      
      
     }

     public makeVis(){
      this.visibilityOfPopularplaces = false;
      this.data.changeVisibilityOfMap(false);
     }

     public getDetailsForWay(placeId: string){
      console.log(placeId);
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

     public createWay(arr: Array<Location>){
      arr.forEach(p => {
        this.getDetailsForWay(p.placeId);
      });
      this.travelModes = ["WALKING", "TRANSIT", "DRIVING", "WALKING", "TRANSIT", "DRIVING"];
      for(var i = 0; i < arr.length - 1; i++){
        if(this.travelModes[i] == "WALKING")
        {
            var dir = {
            origin: {lat: arr[i].lat, lng: arr[i].lng},
            destination: {lat: arr[i+1].lat, lng: arr[i+1].lng},
            travelMode: google.maps.TravelMode.WALKING
            }
            this.dirWalk.push(dir);
        }

        if(this.travelModes[i] == "TRANSIT")
        {
          var dir = {
            origin: {lat: arr[i].lat, lng: arr[i].lng},
            destination: {lat: arr[i+1].lat, lng: arr[i+1].lng},
            travelMode: google.maps.TravelMode.WALKING
            }
            this.dirTrans.push(dir);
        }
        if(this.travelModes[i] == "DRIVING")
        {
          var dir = {
            origin: {lat: arr[i].lat, lng: arr[i].lng},
            destination: {lat: arr[i+1].lat, lng: arr[i+1].lng},
            travelMode: google.maps.TravelMode.DRIVING
            }
            this.dirCar.push(dir);
        }
        if(this.travelModes[i] == "BICYCLING")
        {
          var dir= {
            origin: {lat: arr[i].lat, lng: arr[i].lng},
            destination: {lat: arr[i+1].lat, lng: arr[i+1].lng},
            travelMode: google.maps.TravelMode.BICYCLING
            }
            this.dirBic.push(dir);
        }
      }
      this.visibilityOfPopularplaces = false;
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
    }
}
