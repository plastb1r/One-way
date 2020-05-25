import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import { PlaceDetails } from '../domens/placeDetails';
import { PlacesService } from '../services/places.service';
import { DataService } from '../services/data.service';
import { ThrowStmt } from '@angular/compiler';
import { TriggerService } from '../services/trigger.service';
import { MessageBox, MessageBoxService } from 'message-box-plugin';
import { TokenStorageService } from '../_services/token-storage.service';

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
  types = ['park','tourist_attraction','establishment'];
  places = [];
  visibility: boolean = true;
  wayPlaces:Array<Location> = new Array<Location>();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private placeService: PlacesService,
    private triggerService: TriggerService,
    private messageBoxService: MessageBoxService,
    private tokenStorageService: TokenStorageService,
  )
  {}
  
  ngOnInit() {
    this.setCity();
    this.triggerService.trigger$.subscribe(() => this.setCity());

  }

  setCity(){
    this.cityLocation = JSON.parse(sessionStorage.getItem('cityAddressLocat'));
    this.cityName = sessionStorage.getItem('cityAddress');
    this.placeService.getAll().subscribe(data => this.places=data);
    this.loadPlaces();
    if(sessionStorage.getItem("LocatsToWay")){
      this.wayPlaces = JSON.parse(sessionStorage.getItem("LocatsToWay"));
    }
  }

  loadPlaces(){
    this.placeDetails = [];
    this.locations = [];
    if(sessionStorage.getItem("LocatsToWay")){
      this.wayPlaces = JSON.parse(sessionStorage.getItem("LocatsToWay"));
    }
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
    })

  }

  getPlaces(results, status){
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(this.places);
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
              console.log("place " + this.places[j].placeId);
              console.log("results" + results[i].place_id);
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
            console.log(results[i]);
            let address;
            if(results[i].vicinity == null)
            {
              address= results[i].formatted_address;
            }
            else{
              address = results[i].vicinity;
            }
            this.placeDetails.push({name: results[i].name, address: address,photos: [results[i].photos[0].getUrl()],
              types: results[i].types, rating: results[i].rating});
                
          }
        }

      console.log("locations" + JSON.stringify(this.locations));
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
    //this.locations.splice(i, 1);
    this.locations[ind].choose = false;

    sessionStorage.removeItem('locatsToShowOnMap');
    sessionStorage.setItem('locatsToShowOnMap', JSON.stringify(this.locations));
    console.log("locations" + JSON.stringify(this.locations));
  }

  toggle(){
    this.visibility=!this.visibility;
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
  }
}
