import { Location } from 'src/app/domens/location';
import { Way } from './way';
export class PlaceOnRoute {
    constructor(
      public place: Location,
      public timeToNext: number,
      public transportToNext: string
    ) {}
  }
  