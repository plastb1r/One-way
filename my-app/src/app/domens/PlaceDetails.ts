import { Location } from 'src/app/domens/location';
export class PlaceDetails {
    constructor(
      public name: string,
      public address: string,
      public photos: Array<string>,
      public types: Array<string>,
      public phoneNumber?: string,
      public rating?: number,
    ) {}
}