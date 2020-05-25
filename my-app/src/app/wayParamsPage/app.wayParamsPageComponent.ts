import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {Parameters} from 'src/app/domens/params';
import {NgForm} from '@angular/forms';
import { PlaceDetails } from '../domens/placeDetails';
import { PlacesService } from '../services/places.service';
import { ParametersService } from '../services/parameters.service';
import { PlaceOnRoute } from '../domens/placeOnRoute';
import { WayType } from 'src/app/domens/way_type';
import { PlaceCount } from 'src/app/domens/place_count';
import { MessageBoxService, MessageBox, ButtonType } from  'message-box-plugin';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { TriggerService } from '../services/trigger.service';

@Component({
  templateUrl: './wayParamsPage.html',
  styleUrls: ['./app.wayParamsPageComponent.scss']

})

@Injectable()
export class WayParamsPageComponent implements OnInit{

    @ViewChild('searchpl', {static: true})
    public searchElementRef: ElementRef;

    @ViewChild('startPoint', {static: true})
    public searchElementRefStart: ElementRef;

    @ViewChild('endPoint', {static: true})
    public searchElementRefEnd: ElementRef;

    wayPlaces:Array<Location> = new Array<Location>();
    start = false;
    end = false;

  service;

    public message = "Необходимо ввести начальную и конечную точки маршрута!";

    @ViewChild('map', {static: false})
    mapElement: ElementRef;
  
    map: any;
    cityLocation: Array<Location> ;
    cityName: string;
    placeDetails: Array<PlaceDetails> = new Array<PlaceDetails>();
    locations: Array<Location> = new Array<Location>();
    types = ['establishment','park','tourist_atraction'];
    favorites: Array<boolean> = new Array<boolean>();
    places = [];
    visibility: boolean = false;
    startPoint: Location;
    endPoint: Location;
    parameters: Parameters;
    places_options : Array<number> = [0,1,2,3,4,5,6,7,8,9,10];

    way_options: Array<WayType>  = [
      {name: 'музеи', types: ['museum'],selected: false, places_count:0},
      {name: 'рестораны', types: ['restaurant'],selected: false, places_count: 0},
      {name: 'кофейни', types: ['bakery'],selected: false, places_count: 0},
      {name: 'кафе', types: ['cafe'],selected: false, places_count: 0},
      {name: 'бары', types: ['bar'],selected: false, places_count: 0},
      {name: 'развлечения', types: ['establishment'],selected: false, places_count: 0},
      {name: 'кинотеатры', types: ['movie_theater'],selected: false, places_count: 0},
      {name: 'парки', types: ['park'],selected: false, places_count: 0},
      {name: 'магазины', types: ['shopping_mall'],selected: false, places_count: 0}
    ];

    
    route_places: Array<Location>;
    index = 0;

    geolocation;
    circle;
    options;
  
    constructor(
      private mapsAPILoader: MapsAPILoader,
      private mapsAPILoader2: MapsAPILoader,
      private placeService: PlacesService,
      private ngZone: NgZone,
      private parametersService: ParametersService,
      private messageBoxService: MessageBoxService,
      private tokenStorageService: TokenStorageService,
      private router: Router,
      private triggerService: TriggerService
    )
    {}
  
    ngOnInit() {

      this.setCity();
      this.triggerService.trigger$.subscribe(() => this.setCity());


      this.geolocation = {
        lat: this.cityLocation[0].lat,
        lng: this.cityLocation[0].lng
      };

      this.options = {
        types: ['establishment', 'geocode']
      };

      this.setAutocompliteToStartPoint();
      this.setAutocompliteToEndPoint();

      console.log("Way" + JSON.stringify(this.wayPlaces));
      
      this.mapsAPILoader.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, this.options);
        this.circle = new google.maps.Circle(
          {center: this.geolocation, radius: 70000});
        autocomplete.setBounds(this.circle.getBounds());
        autocomplete.setOptions({strictBounds: true})
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place:  google.maps.places.PlaceResult = autocomplete.getPlace();
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
              this.locations = [];
              this.locations= [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(),placeId: place.place_id}];
              sessionStorage.removeItem('locatsToShowOnMap');
              sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
              sessionStorage.removeItem('detailsToShowOnMap');
              this.placeDetails = [];
              var photo = [];
              photo.push(place.photos[0].getUrl({maxWidth: 400}));
              this.placeDetails.push({name: place.name, address: place.formatted_address, photos: photo,
              types: place.types});
              sessionStorage.setItem('detailsToShowOnMap', JSON.stringify(this.placeDetails));
            });
        });
      })
    }

    setCity(){
      this.cityLocation = JSON.parse(sessionStorage.getItem('cityAddressLocat'));
      this.cityName = sessionStorage.getItem('cityAddress');

      this.placeService.getAll().subscribe(data =>  this.places=data);
      this.loadPlaces();
      if(sessionStorage.getItem("LocatsToWay")){
        this.wayPlaces = JSON.parse(sessionStorage.getItem("LocatsToWay"));
      }
    }
    locs: Array<Location> = new Array<Location>();

    showWay(){
      this.mapsAPILoader.load().then(() => {
        this.locs = JSON.parse(sessionStorage.getItem("LocatsToWay"));
        let city = {lat: 51.673727, lng: 39.21114};
        let mapOptions = {
        center: city,
        zoom: 15
        }
  
        let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.service = new google.maps.places.PlacesService(map);
        this.locs.forEach(p => {
          this.loadPlacesW(p);
        })
        }, (err) => {
            console.log(err);
      });
    }
  
    deleteFromWayW(ind){
      this.locs = JSON.parse(sessionStorage.getItem("LocatsToWay"));
      console.log("before delete" + this.locs);
      console.log(ind);
      this.locs.splice(ind, 1);
      sessionStorage.setItem("LocatsToWay", JSON.stringify(this.locs));
      console.log("Way" + sessionStorage.getItem("LocatsToWay"));
      this.wayPlaces = JSON.parse(sessionStorage.getItem("LocatsToWay"));
      console.log("way" + this.locs);
      this.showWay();
    }
  
    loadPlacesW(p){
      var request = {
      placeId: p.placeId,
      fields: ['name', 'formatted_address',  'photos', "place_id", "geometry", "address_components"]
      };
  
      this.service.getDetails(request, (place, status) => {
          this.getPlacesW(place, status, p);
      });
    }
  
    getPlacesW(results, status,p) {
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
    }
  
    test(){
      console.log(this.way_options);
    }

    onChange(newObj, i) {
      console.log(newObj);
      this.way_options[i].places_count = newObj;
    }
    loadPlaces(){
      this.placeDetails = [];
      if(sessionStorage.getItem("LocatsToWay")){
        this.wayPlaces = JSON.parse(sessionStorage.getItem("LocatsToWay"));
      }
          this.locations = [];
          this.mapsAPILoader.load().then(() => {
            let city = {lat: this.cityLocation[0].lat, lng:  this.cityLocation[0].lng};
            let mapOptions = {
              center: city,
              zoom: 15
            }
      
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            let service = new google.maps.places.PlacesService(this.map);
            if(this.types[0] == "restaurant" || this.types[0] == "bar"){
              service.textSearch(
                {location: city,
                radius: 10000,
                query: this.types[0]
              },
              (results, status) => {
                this.getPlaces(results, status)
              });
            }
            else{
              service.nearbySearch({
                location: city,
                radius: 10000,
                types: this.types
              
              }, (results, status) => {
                  this.getPlaces(results, status)
              });
            }
    
          }, (err) => {
            console.log(err);
          });
        
     
    }
  
    getPlaces(results, status){
      if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.sort(function (a, b) {
            if (a['rating'] < b['rating']) {
              return 1;
            }
            if (a['rating'] > b['rating']) {
              return -1;
            }
            // a должно быть равным b
            return 0;
          });
  
          for (var i = 0; i < results.length ; i++) {
            var choose = false;
            var addedToWay = false;
            if(results[i].photos){
              CancelLoop: for(var j = 0; j<this.places.length; j++){

                if(results[i].place_id == this.places[j].placeId )
                {
                  choose = true;
                  break CancelLoop;
                }
              }
  
              CancelLoop2: for(var j = 0; j<this.wayPlaces.length; j++){
                if(results[i].place_id == this.wayPlaces[j].placeId )
                {
                  addedToWay = true;
                  break CancelLoop2;
                }
              }
            let address;
            if(results[i].vicinity == null)
            {
              address= results[i].formatted_address;
            }
            else{
              address = results[i].vicinity;
            }
              this.locations.push({lat: results[i].geometry.location.lat(), lng:  results[i].geometry.location.lng(),placeId: results[i].place_id , choose: choose, addedToWay: addedToWay});
              this.placeDetails.push({name: results[i].name, address: address,photos: [results[i].photos[0].getUrl()],
                types: results[i].types, rating: results[i].rating});
                  
            }
          }
      }
    }
  
    sendPlaceId(index){
      sessionStorage.removeItem('landmark');
      sessionStorage.setItem("landmark", this.locations[index].placeId);
    }

    sendPlaceIdWay(place){
      sessionStorage.setItem("landmark", place);
    }
  
    sendPopularLocations(){
      sessionStorage.removeItem('locatsToShowOnMap');
      sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
      sessionStorage.removeItem('detailsToShowOnMap');
      sessionStorage.setItem('detailsToShowOnMap', JSON.stringify(this.placeDetails));
    }
  
    setIndex(index: number){
      if(index == 0){
        this.types = ['restaurant','cafe', 'bakery'];
      }
      if(index == 1){
        this.types = ['lodging'];
      }
      if(index == 2){
        this.types= ['bar','liquor_store'];
      }
      if(index == 3){
        this.types = ['establishment','bowling_alley','casino','night_club','movie_theater'];
      }
      if(index == 4){
        this.types = ['museum','art_gallery','painter','library'];
      }
      if(index == 5){
        this.types = ['shopping_mall'];
      }
      if(index == 6){
        this.types = ['park','tourist_attraction'];
      }
    }
  
    toggle(){
      this.visibility=!this.visibility;
    }

    setAutocompliteToStartPoint(){
      this.mapsAPILoader2.load().then(() => {
        this.circle = new google.maps.Circle(
          {center: this.geolocation, radius: 70000});
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRefStart.nativeElement, this.options);
        autocomplete.setBounds(this.circle.getBounds());
        autocomplete.setOptions({strictBounds: true})
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            if (place.geometry === undefined || place.geometry === null) {
              this.startPoint = null;
              this.start = false;
              return;
            }
              this.startPoint = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), placeId: place.place_id};
              this.start = true;
          });
        });
      });
    
    }

    clearAddedPlaces(){
      var locs = new Array<Location>();
      this.locations.forEach(l => 
        {
          l.addedToWay = false;
          sessionStorage.setItem("LocatsToWay", JSON.stringify(locs));
          sessionStorage.removeItem('locatsToShowOnMap');
          sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
        });
     
      console.log("way" + sessionStorage.getItem("LocatsToWay"));
    }

    setAutocompliteToEndPoint(){
      this.mapsAPILoader2.load().then(() => {
        this.circle = new google.maps.Circle(
          {center: this.geolocation, radius: 70000});
      
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRefEnd.nativeElement, this.options);
        
        autocomplete.setBounds(this.circle.getBounds());
        autocomplete.setOptions({strictBounds: true})
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              this.end = false;
              this.endPoint = null;
              return;
            }
            this.endPoint = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(),placeId: place.place_id};
            this.end = true;
          });
        });
       });
       
    }

    addToFavP(index){
      if(!this.tokenStorageService.getUser()){
        let messageBox = MessageBox
        .Create('Хэй, друг)' ,'Войди в систему, чтобы сохранить место :)')
        this.messageBoxService.present(messageBox);
        window.scroll(0,0);
        return 0;
      }
      var loc = {lat: this.locations[index].lat, lng: this.locations[index].lng, placeId: this.locations[index].placeId};
      this.placeService.addPlace(loc).subscribe(data =>console.log(data));
      this.locations[index].choose = true;
      sessionStorage.removeItem('locatsToShowOnMap');
      sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
      this.placeService.getAll().subscribe(data => 
        { this.places=data;});
    }
  
    deleteFromFavP(loc: Location, ind){
      this.placeService.getAll().subscribe(data => 
        { this.places=data;
          var i;
          this.places.forEach(p => {
            if(p.placeId == loc.placeId)
              i = this.places.indexOf(p);
          });
      
          this.placeService.deleteById(this.places[i].placeId).subscribe(data =>console.log(data));
        });
      
      //this.places.splice(i, 1);
      this.locations[ind].choose = false;
  
      sessionStorage.removeItem('locatsToShowOnMap');
      sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
      console.log("locations" + JSON.stringify(this.locations));
    }

    addToWay(i: number){
      var locs = [];
      if(JSON.parse(sessionStorage.getItem("LocatsToWay")) != null){
        locs = JSON.parse(sessionStorage.getItem("LocatsToWay"));
      }
      locs.push(this.locations[i]);
      sessionStorage.setItem("LocatsToWay", JSON.stringify(locs));
      this.locations[i].addedToWay = true;
      sessionStorage.removeItem('locatsToShowOnMap');
      sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
      console.log("Way" + sessionStorage.getItem("LocatsToWay"));
    }
  
    deleteFromWay(j: number){
      var locs = new Array<Location>();
      locs = JSON.parse(sessionStorage.getItem("LocatsToWay"));
      console.log(locs);
      locs.forEach(l => 
        {
          if(l.placeId == this.locations[j].placeId)
          {
            var ind = locs.indexOf(l);
            console.log("index" + ind);
            locs.splice(ind, 1);
            sessionStorage.setItem("LocatsToWay", JSON.stringify(locs));
            console.log("Way" + sessionStorage.getItem("LocatsToWay"));
            this.locations[j].addedToWay = false;
            sessionStorage.removeItem('locatsToShowOnMap');
            sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
            return 0;
          }
        });
     
      console.log("way" + locs);
    }
    placeCount: number = 0;

    loadPlacesForWay(types, placeCount, locats, form: NgForm){
      this.mapsAPILoader.load().then(() => {
        let city = {lat: this.cityLocation[0].lat, lng:  this.cityLocation[0].lng};
        let mapOptions = {
          center: city,
          zoom: 15
        }
  
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        let service = new google.maps.places.PlacesService(this.map);

        service.textSearch(
          {location: city,
          radius: 1000,
          query: types[0]
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {

            if (results.length < placeCount){
              this.placeCount -= Number(placeCount) - Number(results.length);
              console.log("res",results);
              console.log("res",placeCount);
              console.log("res",results.length);
            }
              for (let i = 0; i < placeCount; i++) {
                console.log(this.index);
                locats.push({lat: results[i].geometry.location.lat(), lng:  results[i].geometry.location.lng(),placeId: results[i].place_id , choose: false, addedToWay: false});
                locats[this.index]['rating'] = results[i]['rating'];
                this.index ++;
            }
            
           

            for(var t = 0; t < locats.length; t++)
            {
              for(var j = t + 1; j < locats.length; j++){
                if (locats[t].placeId == locats[j].placeId){
      
                  locats.splice(t, 1);
                  console.log("locats after filtering",locats);
                }
              }
            };

            var transportations = this.setTransportations(form)
            console.log("transport",transportations);

            locats.sort(function (a, b) {
              if (a['rating'] < b['rating']) {
                return 1;
              }
              if (a['rating'] > b['rating']) {
                return -1;
              }
              // a должно быть равным b
              return 0;
            });
            console.log("locats after sorting",locats);

            this.route_places = [];
            console.log("count" + this.placeCount);
            for(var t = 0; t < this.placeCount; t++){
              this.route_places.push(locats[t]);
              console.log(this.route_places);
            }

            
             this.parameters = new Parameters(this.startPoint, this.endPoint, this.route_places, transportations);
              console.log("parameters" +  JSON.stringify(this.parameters));
  
    
             this.parametersService.sendParams(this.parameters).subscribe( data => 
                {
                  sessionStorage.setItem("placesFromRoute", JSON.stringify(data));
                  console.log("params" + sessionStorage.getItem("placesFromRoute"));
                  this.router.navigate(['/mapRoutePage']);
                }
              );
            }
            
        
        });

        /*service.nearbySearch({
          location: city,
          radius: 70000,
          types: types
         
        }, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {

            for (let i = 0; i < placeCount; i++) {
                console.log(this.index);
                locats.push({lat: results[i].geometry.location.lat(), lng:  results[i].geometry.location.lng(),placeId: results[i].place_id , choose: false, addedToWay: false});
                locats[this.index]['rating'] = results[i]['rating'];
                this.index ++;
            }

            for(var t = 0; t < locats.length; t++)
            {
              for(var j = t + 1; j < locats.length; j++){
                if (locats[t].placeId == locats[j].placeId){
      
                  locats.splice(t, 1);
                  console.log("locats after filtering",locats);
                }
              }
            };

            var transportations = this.setTransportations(form)
            console.log("transport",transportations);

            locats.sort(function (a, b) {
              if (a['rating'] < b['rating']) {
                return 1;
              }
              if (a['rating'] > b['rating']) {
                return -1;
              }
              // a должно быть равным b
              return 0;
            });
            console.log("locats after sorting",locats);

            this.route_places = [];
            console.log(placeCount);
            for(var t = 0; t < placeCount; t++){
              this.route_places.push(locats[t]);
            }
            this.parameters = new Parameters(this.startPoint, this.endPoint, this.route_places, transportations);
            console.log("parameters" +  JSON.stringify(this.parameters));

            this.parametersService.sendParams(this.parameters).subscribe( data => 
              {
                sessionStorage.setItem("placesFromRoute", JSON.stringify(data));
                console.log("params" + sessionStorage.getItem("placesFromRoute"));
                window.location.replace("/mapRoutePage");
              }
            );
        }
        });
  */
      }, (err) => {
        console.log(err);
      })
    }

    setPlacesToVisit(form: NgForm): Array<Location>{
      let locats = new Array<Location>();
      this.way_options.forEach(el => {
        if(el.selected){
          //this.placeCount += Number(el.places_count);
          this.loadPlacesForWay(el.types,el.places_count,locats, form);
        }
      });
    
      return locats;
    }

    setTransportations(form: NgForm): Array<string>{
      var transportations = new Array<string>();

      if(form.controls['WALKING'].value)
      {
        transportations.push("walking");
      }
      if(form.controls['DRIVING'].value)
      {
        transportations.push("driving");
      }
      if(form.controls['TRANSIT'].value)
      {
        transportations.push("transit");
      }
      if(form.controls['BICYCLING'].value)
      {
        transportations.push("bicycling");
      }

      if(transportations.length == 1 && form.controls['BICYCLING'].value){
        transportations = ["walking", "bicycling"];
      }

      if(transportations.length == 1 && form.controls['TRANSIT'].value){
        transportations = ["walking", "transit"];
      }

      if(transportations.length == 0){
        transportations = ["walking"];
      }

      console.log(transportations);
      return transportations;
    }

    setParams(form: NgForm) { 

      if(this.startPoint == null || this.endPoint ==null){
        let user;
        if(this.tokenStorageService.getUser())
        {
            user = this.tokenStorageService.getUser().username;
        }
        else{
            user = ' друг)';
        }
       
        let messageBox = MessageBox
        .Create('Хэй,' + user,'Необходимо указать начальную и конечную точки маршрута :)')
        this.messageBoxService.present(messageBox);
        window.scroll(0,0);
      }

      var transportations = this.setTransportations(form);
      //let placesToVisit: number =  form.controls['placesToVisit'].value;
      let createWay: boolean = false;

      let locats = new Array<Location>();

      if(sessionStorage.getItem("LocatsToWay")){
        locats = JSON.parse(sessionStorage.getItem("LocatsToWay"));
        createWay = true;
      }

      if(locats.length == 0){
        createWay = false;
        this.index = 0;
        this.route_places = [];
        this.setPlacesToVisit(form);
      }

      if(createWay){
        this.parameters = new Parameters(this.startPoint, this.endPoint, locats, transportations);
        this.parametersService.sendParams(this.parameters).subscribe( data => 
          {
            sessionStorage.setItem("placesFromRoute", JSON.stringify(data));
            console.log("params" + sessionStorage.getItem("placesFromRoute"));
            this.router.navigate(['/mapRoutePage']);
            //window.location.replace("/mapRoutePage");
          } 
        );
      }



      console.log(this.startPoint);
      console.log( this.endPoint);

      
    }

    sum(){
      this.placeCount = 0;
      this.way_options.forEach(el => {
        if(el.selected){
          this.placeCount += Number(el.places_count);
        }
      });

    }
}
