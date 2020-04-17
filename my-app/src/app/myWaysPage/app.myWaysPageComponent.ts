import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';
import { Way } from 'src/app/domens/way';
import { User } from 'src/app/domens/user';
import { RoutesService } from '../services/routes.service';

@Component({
  templateUrl: './myWaysPage.html',
  styleUrls: ['./app.myWaysPageComponent.scss']

})
export class MyWaysPageComponent implements OnInit{

  //cityName: string;
  photo: Array<string> = new Array<string>();
  myWays: Array<Way> = new Array<Way>();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dataSer: DataService,
    private httpService: HttpService,
    private routeService:RoutesService
  ) { }

  ngOnInit() {
    this.routeService.getAll().subscribe(data => {
      console.log("routes" + data);
      this.myWays=data; 
      //this.places.forEach(f => this.loadPlaces(f.placeId));
    });
    //this.cityLocation = JSON.parse(sessionStorage.getItem('cityAddressLocat'));
  }
    //this.myWays = [new Way(0, locs,"Montreal, QC, Canada","Тестовый путь 1"), this.myWay];
    

  newLocation(i: number){
    console.log("index" + i);
    //this.dataSer.changeWay1(this.myWays[i]);
  }

  getPhDetails(placeId: string){
    this.httpService.getData(placeId).subscribe( value =>{
        var phot = value['result']['photos'];
        var photoRe = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference='+phot[0]['photo_reference']+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ';
        this.photo.push(photoRe);
    });
  }
}
