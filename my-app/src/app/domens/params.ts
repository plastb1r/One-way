import { Location } from 'src/app/domens/location';
export class Parameters {
    constructor(
      public startPoint: Location,
      public endPoint: Location,
      public freeHours: number,
      public typesOfWay: Array<string>,
      public typesOfTransport: Array<string>,
      public placesToVisit: number
    ) {}
  }