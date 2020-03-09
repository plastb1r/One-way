import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import {User} from 'src/app/domens/user';

@Component({
  templateUrl: './profilePage.html',
  styleUrls: ['./app.profilePageComponent.scss']

})
export class ProfilePageComponent{
  /*user: User = new User("", "Иван", "Москва", "ivan@gmail.com", 89515555555, "", "", "ivan01", "hhhh");

  constructor(){
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dataSer: DataService,
    private http: HttpClient,
    private httpService: HttpService
  }
  ngOnInit() {

  }

  showWay(){
    var ph = [];
    this.way.points.forEach(p => {
      this.getDetails(p.placeId);
    });
    //this.data.changePhotos(ph);
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

      this.index = 0;
      var ref = []
      phot.forEach(ph => {
        ref.push(ph['photo_reference']);
      });

      var photoRes = [];
        ref.forEach(ph => {
          photoRes.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+ph+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ')
        });
      //console.log(value['result']['place_id']);
      this.data.push({photo: photoRes[0],name: name,address: address,index: this.index, isAdded: true});
      this.photos.push(photoRes);
      this.number.push(number);
      this.rating.push(rating);
      this.types.push(types);
    });
  }*/
}
