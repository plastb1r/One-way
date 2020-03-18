import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import { Way } from 'src/app/domens/way';

@Component({
  templateUrl: './landmarkPage.html',
  styleUrls: ['./app.landmarkPageComponent.css']

})
export class LandmarkPageComponent implements OnInit{
  rating: number;
  periods: [];
  address: string;
  photo: Array<string>;
  name: string;
  types: Array<string>;
  number: string;
  open_hours: Array<Array<string>>;
  open: Array<any>;
  close: Array<any>;
  loc: Location;
  wayArray: Array<Location> = new Array<Location>();
  way: Way;
  ind = 0;

  @ViewChild('searchlm', {static: true})
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private data: DataService
  ) { }

  checkLocInArray(){
    this.data.currentWay.subscribe(w => this.way = w);
    this.way.points.forEach(l => {
      if (l.lat == this.loc.lat && l.lng == this.loc.lng)
      {
        this.ind = 1;
      }
    });
    /*this.data.currentWayLocations.subscribe(loc => this.wayArray = loc);
    this.wayArray.forEach(l => {
      if (l.lat == this.loc.lat && l.lng == this.loc.lng)
      {
        this.ind = 1;
      }
    });*/
  }

  addToWay(){
    this.checkLocInArray();
    this.way.name = 'Тестовый путь 2';
    this.data.currentCityName.subscribe(w => this.way.cityAddress = w);
    this.way.index = 1;
    if(this.ind == 0){
      this.data.changeWay(this.loc, this.way, 1);
    }
    console.log(this.way);
  }

  ngOnInit() {
    //this.data.currentLM.subscribe({loc, photo, rating, address, name, number, types} => {this.longitude: loc.lng,this.photo: photo, this.rating: rating, this.address: address, this.name: name, this.number: number, this.types : types});
    this.data.currentLoc.subscribe(loc => this.loc = loc);
    this.data.currentPh.subscribe(ph => this.photo = ph);
    this.data.currentRat.subscribe(rat => this.rating = rat);
    this.data.currentAds.subscribe(ads => this.address = ads);
    this.data.currentName.subscribe(name => this.name = name);
    this.data.currentTypes.subscribe(tp => this.types = tp);
    this.data.currentNbr.subscribe(nbr => this.number = nbr);
  }
}
