import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import { Way } from 'src/app/domens/way';
import { HttpClient } from '@angular/common/http';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import {Parameters} from 'src/app/domens/params';
import {NgForm} from '@angular/forms';
import { PopularLandmarksPageComponent } from '../popularLandmarksPage/app.popularLandmarksPageComponent';
import { PlaceDetails } from '../domens/placeDetails';
import { PlacesService } from '../services/places.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ParametersService } from '../services/parameters.service';
import { PlaceOnRoute } from '../domens/placeOnRoute';

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

    /*locations: Array<Location> = new Array<Location>();
    locations1: Array<Location> = new Array<Location>();
    test;
    label = "Добавлено";
    photo: Array<string>;
    name:Array<string>;
    cityName: string;
    address:  Array<string>;
    city: Location;
    cityLocation: Array<Location> ;
    types:  Array<any>;
    number: string;
    rating: Array<number>;
    photos: Array<string>;
    visibility: boolean = true;
    index: number = -1;
    dataLM: Array<Data>;
    pt: string = "";
    wayArray: Array<Location> = new Array<Location>();
    ind: number = 0;
    //prev = this.locations;
    way: Way;
    favP: Array<Location>;
    submitted = false;
    parameters: Parameters;
    */

    @ViewChild('map', {static: false})
    mapElement: ElementRef;
  
    map: any;
    cityLocation: Array<Location> ;
    cityName: string;
    placeDetails: Array<PlaceDetails> = new Array<PlaceDetails>();
    locations: Array<Location> = new Array<Location>();
    types = ['park','tourist_attraction','aquarium'];
    favorites: Array<boolean> = new Array<boolean>();
    places = [];
    visibility: boolean = false;
    startPoint: Location;
    endPoint: Location;
    parameters: Parameters;
  
    constructor(
      private mapsAPILoader: MapsAPILoader,
      private mapsAPILoader2: MapsAPILoader,
      private placeService: PlacesService,
      private ngZone: NgZone,
      private parametersService: ParametersService
    )
    {}
  
    ngOnInit() {
      this.setAutocompliteToStartPoint();
      this.setAutocompliteToEndPoint();
      this.cityLocation = JSON.parse(sessionStorage.getItem('cityAddressLocat'));
      this.cityName = sessionStorage.getItem('cityAddress');
      this.placeService.getAll().subscribe(data =>  this.places=data);
      this.loadPlaces();
      if(sessionStorage.getItem("LocatsToWay")){
        this.wayPlaces = JSON.parse(sessionStorage.getItem("LocatsToWay"));
      }
      console.log("Way" + JSON.stringify(this.wayPlaces));
      this.mapsAPILoader.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        });
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
  
    loadPlaces(){
      this.placeDetails = [];
      this.locations = [];
      this.mapsAPILoader.load().then(() => {
        let city = {lat: this.cityLocation[0].lat, lng:  this.cityLocation[0].lng};
        let mapOptions = {
          center: city,
          zoom: 15
        }
  
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        let service = new google.maps.places.PlacesService(this.map);
        service.nearbySearch({
          location: city,
          radius: 10000,
          types: this.types
         
        }, (results, status) => {
            this.getPlaces(results, status)
        });
  
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
  
          for (var i = 1; i < results.length ; i++) {
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
              this.locations.push({lat: results[i].geometry.location.lat(), lng:  results[i].geometry.location.lng(),placeId: results[i].place_id , choose: choose, addedToWay: addedToWay});
              this.placeDetails.push({name: results[i].name, address: results[i].vicinity,photos: [results[i].photos[0].getUrl()],
                types: results[i].types, rating: results[i].rating});
                  
            }
          }

      }
    }
  
    sendPlaceId(index){
      sessionStorage.removeItem('landmark');
      sessionStorage.setItem("landmark", this.locations[index].placeId);
    }
  
    sendPopularLocations(){
      //this.data.changeLocations(this.locations);
      sessionStorage.removeItem('locatsToShowOnMap');
      sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
      sessionStorage.removeItem('detailsToShowOnMap');
      sessionStorage.setItem('detailsToShowOnMap', JSON.stringify(this.placeDetails));
    }
  
    setIndex(index: number){
      if(index == 0){
        this.types = ['restaurant','cafe', 'bakery', 'food'];
      }
      if(index == 1){
        this.types = ['lodging'];
      }
      if(index == 2){
        this.types= ['bar','liquor_store'];
      }
      if(index == 3){
        this.types = ['amusement_park','bowling_alley','casino','night_club','movie_theater','establishment'];
      }
      if(index == 4){
        this.types = ['museum','art_gallery','painter','library'];
      }
      if(index == 5){
        this.types = ['clothing_store','shoe_store','shopping_mall'];
      }
      if(index == 6){
        this.types = ['park','tourist_attraction','aquarium'];
      }
    }
  
    toggle(){
      this.visibility=!this.visibility;
    }


    setAutocompliteToStartPoint(){
      this.mapsAPILoader2.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRefStart.nativeElement, {

        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.startPoint = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), placeId: place.place_id};
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
          return 0;
        });
      sessionStorage.removeItem('locatsToShowOnMap');
      sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
      console.log("way" + sessionStorage.getItem("LocatsToWay"));
    }

    setAutocompliteToEndPoint(){
      this.mapsAPILoader2.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRefEnd.nativeElement, {

        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.endPoint = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(),placeId: place.place_id};
          });
        });
       });
       
    }

    addToFavP(index){
      var loc = {lat: this.locations[index].lat, lng: this.locations[index].lng, placeId: this.locations[index].placeId};
      this.placeService.addPlace(loc).subscribe(data =>console.log(data));
      this.locations[index].choose = true;
      sessionStorage.removeItem('locatsToShowOnMap');
      sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
    }
  
    deleteFromFavP(loc: Location, ind){
      var i;
      this.places.forEach(p => {
        if(p.placeId == loc.placeId)
          i = this.places.indexOf(p);
      });
  
      this.placeService.deleteById(this.places[i].placeId).subscribe(data =>console.log(data));
      this.places.splice(i, 1);
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
            return 0;
          }
        });
      this.locations[j].addedToWay = false;
      sessionStorage.removeItem('locatsToShowOnMap');
      sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
      console.log("way" + locs);
    }

    setParams(form: NgForm) { 
      
      var freeHours = form.controls['freeHours'].value;
      var placesToVisit =  form.controls['placesToVisit'].value;
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

      if(transportations.length == 0){
        transportations = ["walking"];
      }
      var locats = new Array<Location>();
      locats = JSON.parse(sessionStorage.getItem("LocatsToWay"));
      this.parameters = new Parameters(this.startPoint, this.endPoint,locats,transportations);
      console.log("parameters" +  this.parameters);
      console.log(this.startPoint);
      console.log( this.endPoint);
      let placesFromRoute = Array<PlaceOnRoute>();

      this.parametersService.sendParams(this.parameters).subscribe( data => 
        {
          sessionStorage.setItem("placesFromRoute", JSON.stringify(data));
          console.log("params" + sessionStorage.getItem("placesFromRoute"));
          window.location.replace("/mapRoutePage");
        }
      );
    }

    


    /*ngOnInit() {
      this.data.currentLocations.subscribe(loc => this.cityLocation = [{lat:loc[0].lat, lng:loc[0].lng, zoom: 15, placeId:loc[0].placeId,  choose: false}]);
      this.setPopPlaces();
      this.data.currentCityName.subscribe(ads => this.cityName = ads);

      this.setAutocompliteToStartPoint();
      this.setAutocompliteToEndPoint();

      this.mapsAPILoader.load().then(() => {
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
            
            this.locations = [{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: 15, placeId: place.place_id,choose: false}];
            this.getDetails(place.place_id);
            var data = [];
            data.push({photo: this.photo[0],
              address:  this.address[0],
              name: this.name[0],
              index: 0,
              isAdded: false
            });
            this.dataLM=data;
            //this.loc = {lat:place.geometry.location.lat(),lng: place.geometry.location.lng(), zoom: 15}
          });
        });
       });
    }

    setParams(form: NgForm) { 
      
      var freeHours = form.controls['freeHours'].value;
      var placesToVisit =  form.controls['placesToVisit'].value;
      var transportations = new Array<string>();

      if(form.controls['WALKING'].value)
      {
        transportations.push("WALKING");
      }
      if(form.controls['DRIVING'].value)
      {
        transportations.push("DRIVING");
      }
      if(form.controls['TRANSIT'].value)
      {
        transportations.push("TRANSIT");
      }

      console.log("transport " +  transportations);
     
      this.parameters = new Parameters(this.startPoint, this.endPoint, freeHours, new Array<string>(),transportations, placesToVisit);
      console.log("parameters" +  this.parameters);
      console.log("hours " +  this.parameters.freeHours);
      console.log("places " +  this.parameters.placesToVisit);
      console.log("transport " +  this.parameters.typesOfTransport);

     // this.httpService.sendPlacesToAlgorythm(this.way.points).subscribe(
        //(data: Array<Location>) => {this.locations2=data;}
      //);
        //this.createWay(this.locations2);
    }

    findPlace(){
      var data = [];
      data.push({photo: this.photo[0],
        address:  this.address[0],
        name: this.name[0],
        index: 0,
        isAdded: false
      });
      this.dataLM=data;
    }

    setAutocompliteToStartPoint(){
      this.mapsAPILoader2.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRefStart.nativeElement, {

        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.startPoint = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: 15, placeId: place.place_id,choose: false};
          });
        });
       });
       
    }

    setAutocompliteToEndPoint(){
      this.mapsAPILoader2.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRefEnd.nativeElement, {

        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.endPoint = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: 15, placeId: place.place_id,choose: false};
          });
        });
       });
       
    }


    loadMorePopPlaces(){
      this.prev = this.locations;
      this.setPopPlaces();
      this.locations = this.prev.concat(this.locations);
    }

    onSubmit()
    {
      this.submitted = true;
    }

    setPopPlaces(){
      this.city = this.cityLocation[0];
      console.log(this.city);
      this.httpService.getPopPlaces(this.city, this.index, this.pt).subscribe(city => {this.test = city['results'];
      this.pt = city['next_page_token'];
      this.test.sort(function (a, b) {
          if (a['rating'] < b['rating']) {
            return 1;
          }
          if (a['rating'] > b['rating']) {
            return -1;
          }
          // a должно быть равным b
          return 0;
        });
        console.log(this.test);
        var ratings = [];
        var names = [];
        var addresses = [];
        var locats = [];
        var ref = [];
        var types = [];
        this.test.forEach((loc) => {
          if(loc['photos']){
            names.push(loc['name']);
            addresses.push(loc['vicinity']);
            locats.push({lat: loc['geometry']['location']['lat'],lng: loc['geometry']['location']['lng'], zoom: 15, placeId: loc['place_id'],  choose: false});
            ref.push(loc['photos'][0]['photo_reference']);
            ratings.push(loc['rating']);
            types.push(loc['types']);
          }
        });
        var photoRes = [];
        ref.forEach(ph => {
          photoRes.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+ph+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ')
        });
        this.photo = photoRes;
        console.log(ref);
        //console.log(locats[0].placeId);
        this.rating = ratings;
        this.name = names;
        this.address = addresses;
        this.locations = locats;
        this.types = types;

        var data = [];
        for(var i= 0;i < photoRes.length; i++ )
        {
          data.push({photo: this.photo[i],
            address:  this.address[i],
            name: this.name[i],
            index: i,
            isAdded: false
          });
        }

        this.dataLM=data;

        //var t = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+locats[0].placeId+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ';
        //console.log('fffff' + t);
        //this.number = t['result']['international_phone_number'];
      });
    }
    setIndex(index: number){
      this.index = index;
    }

    changePopularLocations(){
      console.log(this.locations);
      this.data.changeLocations(this.locations);
    }

    getDetails(placeId: string){
    this.httpService.getData(placeId).subscribe( value =>{
        this.name = [value['result']['name']];
        this.address = [value['result']['formatted_address']];
        //this.rating = value['result']['rating'];
        //this.types = value['result']['types'];
        //this.number = value['result']['international_phone_number'];
        //this.loc = {lat:value['result']['geometry']['location']['lat'],lng: value['result']['geometry']['location']['lng'], zoom: 15,placeId: value['place_id'],  choose: false};
        var phot = value['result']['photos'];
        var photoRe = [];
          phot.forEach(ph => {
            photoRe.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+ph['photo_reference']+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ')
          });
        this.photo = photoRe;
      });
    }

    newLocation(i: number){
      console.log(this.locations[i].placeId);
      //this.getDetails(this.locations[0].placeId);
      this.data.changeLandMark(this.locations[i]);
      this.data.changePhotos(this.photo);
      this.data.changeRating(this.rating[i]);
      this.data.changeAddress(this.address[i]);
      this.data.changeName(this.name[i]);
      this.data.changeTypes(this.types[i]);
      this.data.changeNumber(this.number);

    }

    checkLocInArray(i: number){
      this.data.currentWay.subscribe(w => this.way = w);
      this.way.points.forEach(l => {
        if (l.lat == this.locations[i].lat && l.lng == this.locations[i].lng)
        {
          this.ind = 1;
        }
      });
    }

    addToWay(i: number){
      this.checkLocInArray(i);
      this.way.name = 'Тестовый путь';
      this.data.currentCityName.subscribe(w => this.way.cityAddress = w);
      if(this.ind == 0){
        this.data.changeWay(this.locations[i], this.way, 1);
      }
      console.log(this.way);
      this.dataLM[i].isAddedToWay = !this.dataLM[i].isAddedToWay;
    }

    checkFavPInArray(i: number){
      this.data.currentFavP.subscribe(f => this.favP = f);
      this.favP.forEach(f => {
        if (f.placeId == this.locations[i].placeId)
        {
          this.ind = 1;
        }
        else {
          this.ind = 0;
        }
      });
    }
  //problem with second
    addToFavP(i: number){
      this.checkFavPInArray(i);
      if(this.ind == 0){
        this.data.changeFavP(this.locations[i], this.favP);
      }
      this.dataLM[i].isAddedToFav = !this.dataLM[i].isAddedToFav;
      if(this.dataLM[i].isAddedToFav == false) {
        this.data.changeFavPRemove(this.locations[i], this.favP);
      }
    console.log(this.favP);
    }*/
}
