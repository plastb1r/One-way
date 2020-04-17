import { Location } from 'src/app/domens/location';
import { Way } from './way';
export class PlaceOnRoute {
    constructor(
      public origin: {lat: number, lng: number},
      public destination: {lat: number, lng: number},
      public travelMode: string
    ) {}
  }
  