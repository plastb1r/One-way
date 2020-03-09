import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import { User } from 'src/app/domens/user';

@Component({
  templateUrl: './myFavoritePlacesPage.html',
  styleUrls: ['./app.myFavoritePlacesPageComponent.scss']

})
export class MyFavoritePlacesPageComponent{
  locations2: Array<Location>;
  data: Array<Data> = new Array<Data>();
  types:  Array<any> = new Array<any>();
  number: Array<string> = new Array<string>();
  rating: Array<number> = new Array<number>();
  way: Way;
  index: number = -1;
  visibility: boolean = false;
  photos: Array<Array<string>> = new Array<Array<string>>();
  dir = undefined;
  //инфа о юзере из бд
  myWays: Array<Way> = new Array<Way>();
  myFavP: Array<Location> = new Array<Location>();
  user: User;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dataSer: DataService,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.dataSer.currentFavP.subscribe(f => this.myFavP = f);
    this.user = new User("", "Ivan", "Voronezh", "ivan@gmail.com", 9999999, "twit", "faceb", "ivan1", "9999", this.myWays, this.myFavP);
    var ph = [];
    this.user.favPlaces.forEach(p => {
      this.getDetails(p.placeId);
    });
    console.log(this.user.favPlaces);
  }

  public getDetails(placeId: string){
    this.httpService.getData(placeId).subscribe( value =>{
      //var loc = {lat:value['result']['geometry']['location']['lat'],lng: value['result']['geometry']['location']['lng'], zoom: 15, placeId: value['result']['place_id'],  choose: false};
      var phot = value['result']['photos'];
      var name = value['result']['name'];
      var address = value['result']['formatted_address'];
      var rating = value['result']['rating'];
      var types = value['result']['types'];
      var number = value['result']['international_phone_number'];

      this.index += 1;
      var ref = []
      phot.forEach(ph => {
        ref.push(ph['photo_reference']);
      });

      var photoRes = [];
        ref.forEach(ph => {
          photoRes.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+ph+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ')
        });
      //console.log(value['result']['place_id']);
      this.data.push({photo: photoRes[0],name: name,address: address,index: this.index, isAddedToWay: true, isAddedToFav: true});
      this.photos.push(photoRes);
      this.number.push(number);
      this.rating.push(rating);
      this.types.push(types);
    });
  }

  newLocation(i: number){
    this.dataSer.changeLandMark(this.user.favPlaces[i]);
    this.dataSer.changePhotos(this.photos[i]);
    this.dataSer.changeRating(this.rating[i]);
    this.dataSer.changeAddress(this.data[i].address);
    this.dataSer.changeName(this.data[i].name);
    this.dataSer.changeTypes(this.types[i]);
    this.dataSer.changeNumber(this.number[i]);
  }

  deleteFav(i: number){
    this.user.favPlaces.splice(i, 1);
    console.log(this.user.favPlaces);
  }

}
