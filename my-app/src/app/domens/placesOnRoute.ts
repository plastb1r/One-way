import { Location } from 'src/app/domens/location';
import { Way } from './way';
export class PlaceOnRoute {
    constructor(
      public id: number,
      public index: number,
      public place: Location,
      public route: Way,
      public timeToNext: number,
      public transportToNext: string
    ) {}
  }
  