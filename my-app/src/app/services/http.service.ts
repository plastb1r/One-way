import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Location } from 'src/app/domens/location';

@Injectable()
export class HttpService{

    constructor(private http: HttpClient, private httpph: HttpClient){ }
    url;
    phurl;
    cityUrl;
    getData(placeId: string){

      const headers = new HttpHeaders({
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Requested-With": "XMLHttpRequest",
        "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      })
      this.url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+placeId+'&language=ru&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ';
      return this.http.request('GET',this.url);
    }

    getPopPlaces(loc: Location, index: number, pt: string){
      var latit = String(loc.lat);
      var longt = String(loc.lng);
      switch(index){
        case -1: {
          this.cityUrl ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latit+','+longt+'&radius=10000&type=point_of_interest&pagetoken='+pt+'&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ&language=ru';
          break;
        }
        case 0: {
          this.cityUrl ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latit+','+longt+'&radius=10000&type=restaurant&cafe&food&bakery&keyword=restaurant&cafe&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ&language=ru';
          break;
        };
        case 1: {
          this.cityUrl ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latit+','+longt+'&radius=10000&type=lodging&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ&language=ru';
          break;
        };
        case 2: {
          this.cityUrl ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latit+','+longt+'&radius=10000&type=bar&liquor_store&keyword=bar&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ&language=ru';
          break;
        };
        case 3: {
          this.cityUrl ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latit+','+longt+'&radius=10000&type=amusement_park&bowling_alley&casino&night_club&movie_theater&establishment&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ&language=ru';
          break;
        };
        case 4: {
          this.cityUrl ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latit+','+longt+'&radius=10000&type=museum&art_gallery&painter&library&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ&language=ru';
          break;
        };
        case 5: {
          this.cityUrl ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latit+','+longt+'&radius=10000&type=clothing_store&shoe_store&shopping_mall&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ&language=ru';
          break;
        };
        case 6: {
          this.cityUrl ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latit+','+longt+'&radius=10000&type=park&tourist_attraction&aquarium&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ&language=ru';
          break;
        }

      }
      //this.cityUrl ='https://maps.googleapis.com/maps/api/place/textsearch/json?query=new+york+city+point+of+interest&language=en&key=AIzaSyBMgGGii-qFTTx5Obv-gwHljLtZbt8fAbQ';

      return this.http.request('GET',this.cityUrl);
    }
}
