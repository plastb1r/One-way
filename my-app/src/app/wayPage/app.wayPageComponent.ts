import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from 'src/app/domens/location';
import {DataService} from 'src/app/services/data.service';
import { Way } from 'src/app/domens/way';
import { HttpClient } from '@angular/common/http';
import {HttpService} from 'src/app/services/http.service';
import { Data } from 'src/app/domens/data';

@Component({
  templateUrl: './wayPage.html',
  styleUrls: ['./app.wayPageComponent.scss']

})
export class WayPageComponent{
  locations2: Array<Location>;
  data: Array<Data> = new Array<Data>();
  types:  Array<any> = new Array<any>();
  number: Array<string> = new Array<string>();
  rating: Array<number> = new Array<number>();
  way: Way;
  index: number = -1;
  photos: Array<Array<string>> = new Array<Array<string>>();
  dir = undefined;
  visibility: Array<boolean> = new Array<boolean>();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dataSer: DataService,
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  toggle(index: number){
    this.visibility[index] = !this.visibility[index];
  }

  ngOnInit() {
    //this.data.currentLM.subscribe({loc, photo, rating, address, name, number, types} => {this.longitude: loc.lng,this.photo: photo, this.rating: rating, this.address: address, this.name: name, this.number: number, this.types : types});
    //this.data.currentPh.subscribe(ph => this.photo = ph);
    //this.dataSer.currentWay.subscribe(w => this.way = w);

    /*var accordionContainer = document.querySelector('.accordion-container');
    if (accordionContainer) {
      accordionContainer.addEventListener('click', function (e) {
        //var header = e.target.closest('.accordion__header');
        if (!header) return;
        //var accordion = header.parentNode;
        var content = header.nextElementSibling;
        var height = content.firstElementChild.getBoundingClientRect().height;

        if (accordion.classList.contains('is-open')) {
          content.style.height = '0px';
          accordion.classList.remove('is-open');
        } else {
          content.style.height = height + 'px';
          accordion.classList.add('is-open');
        }
      });
    }*/
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

    
}
