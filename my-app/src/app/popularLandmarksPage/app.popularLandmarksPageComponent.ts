import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import { PlaceDetails } from '../domens/PlaceDetails';
import { PlacesService } from '../services/places.service';

@Component({
  selector: 'popular_landmarks',
  templateUrl: './popularLandmarksPage.html',
  styleUrls: ['./app.popularLandmarksPageComponent.scss']
})

@Injectable()
export class PopularLandmarksPageComponent implements OnInit{
  @ViewChild('map', {static: false})
  mapElement: ElementRef;

  map: any;
  cityLocation: Array<Location> ;
  cityName: string;
  placeDetails: Array<PlaceDetails> = new Array<PlaceDetails>();
  locations: Array<Location> = new Array<Location>();
  types = [];
  favorites: Array<boolean> = new Array<boolean>();
  places = [];
  visibility: boolean = true;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private placeService: PlacesService
  )
  {}

  
  ngOnInit() {
    //this.data.currentLocations.subscribe(loc => this.cityLocation = [{lat:loc[0].lat, lng:loc[0].lng, zoom: 15, placeId:loc[0].placeId,  choose: false}]);
    this.cityLocation = JSON.parse(sessionStorage.getItem('cityAddressLocat'));
    this.cityName = sessionStorage.getItem('cityAddress');
    this.placeService.getAll().subscribe(data =>  this.places=data);
    this.loadPlaces();
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
          if(results[i].photos){
            this.places.forEach(pl => {
              if(pl.placeId == results[i].place_id)
              {
                this.favorites.push(true);
              }
              else{ this.favorites.push(false)}
            });

            
            this.placeDetails.push({name: results[i].name, address: results[i].vicinity,photos: [results[i].photos[0].getUrl()],
              types: results[i].types, rating: results[i].rating});
            this.locations.push({lat: results[i].geometry.location.lat(), lng:  results[i].geometry.location.lng(),placeId: results[i].place_id });
          }
        }
      console.log("details" + this.placeDetails);
      console.log("locations" + this.locations);
      console.log("favs" + this.favorites);
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

  addToFavP(index){
    var loc = {lat: this.locations[index].lat, lng: this.locations[index].lng, placeId: this.locations[index].placeId};
    this.placeService.addPlace(loc).subscribe(data =>console.log(data));
  }

  toggle(){
    this.visibility=!this.visibility;
  }

  /*locations: Array<Location>;
  test;
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
  ind2: number = 0;
  prev = this.locations;
  way: Way;
  favP: Array<Location>;

  placeDetails: PlaceDetails[];
  locats: Location[];
  map;


  /*getDetails(placeId: string){
  this.httpService.getData(placeId).subscribe( value =>{
      //this.name = value['result']['name'];
      //this.address = value['result']['formatted_address'];
      //this.rating = value['result']['rating'];
      this.types = value['result']['types'];
      //this.number = value['result']['international_phone_number'];
      //this.loc = {lat:value['result']['geometry']['location']['lat'],lng: value['result']['geometry']['location']['lng'], zoom: 15,placeId: value['place_id'],  choose: false};
      var phot = value['result']['photos'];
      var photoRe = [];
        phot.forEach(ph => {
          photoRe.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+ph['photo_reference']+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ')
        });
      this.photos = photoRe;
      console.log(this.photos);
      //this.photo = this.photos[0];
    });
  }

  changeIndInArray(i: number){
    this.data.currentWay.subscribe(w => this.way = w);
    this.way.points.forEach(l => {
      if (l.lat == this.locations[i].lat && l.lng == this.locations[i].lng)
      {
        this.ind2 = 1;
      }
      else {this.ind2 = 0;}
    });
  }

  addToWay(i: number){
    this.changeIndInArray(i);
    this.way.name = 'Тестовый путь 2';
    this.way.index = 1;
    this.data.currentCityName.subscribe(w => this.way.cityAddress = w);
    if(this.ind2 == 0){
      this.data.changeWay(this.locations[i], this.way, 1);
    }
    //this.data.currentWay.subscribe(w => this.way = w);
    console.log(this.way);
    this.dataLM[i].isAddedToWay = !this.dataLM[i].isAddedToWay;
  }

  removeFromWay(i: number){
    this.changeIndInArray(i);
    if(this.ind2 == 1){
      this.data.changeWay(this.locations[i], this.way, 2);
    }
    //this.data.currentWay.subscribe(w => this.way = w);
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
