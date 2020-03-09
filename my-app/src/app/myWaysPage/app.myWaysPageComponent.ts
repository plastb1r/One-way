import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import { User } from 'src/app/domens/user';

@Component({
  templateUrl: './myWaysPage.html',
  styleUrls: ['./app.myWaysPageComponent.scss']

})
export class MyWaysPageComponent implements OnInit{

  //cityName: string;
  photo: Array<string> = new Array<string>();
  myWays: Array<Way> = new Array<Way>();
  myFavP: Array<Location> = new Array<Location>();
  myWay: Way = new Way(0, new Array<Location>(), "", "");
  user: User;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dataSer: DataService,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.dataSer.currentFavP.subscribe(f => this.myFavP = f);
    this.dataSer.currentWay.subscribe(w => this.myWay = w);
    //this.dataSer.currentCityName.subscribe(ads => this.cityName = ads);
    //this.myWays.push(this.myWay);
    var locs = [new Location( 45.49662480000001,-73.5729448, 15, "ChIJTXHP1WkayUwRIQHlGieFpoA", false), new Location(45.50431820000001,
      -73.5622268, 15, "ChIJpRujkVoayUwR1waz1cDpTew", false)];
    this.myWays = [new Way(0, locs,"Montreal, QC, Canada","Тестовый путь 1"), this.myWay];
    this.user = new User("", "Ivan", "Voronezh", "ivan@gmail.com", 9999999, "twit", "faceb", "ivan1", "9999", this.myWays, this.myFavP);
    this.myWays.forEach(w => {
      this.getPhDetails(w.points[0].placeId);
    })
    //this.myWays = this.user.ways;
  }

  //проблема с переадресовкой пути

  newLocation(i: number){
    console.log("index" + i);
    this.dataSer.changeWay1(this.myWays[i]);
  }

  getPhDetails(placeId: string){
    this.httpService.getData(placeId).subscribe( value =>{
        var phot = value['result']['photos'];
        var photoRe = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+phot[0]['photo_reference']+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ';
        this.photo.push(photoRe);
    });
  }
}
