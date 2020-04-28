import { Location } from 'src/app/domens/location';
export class Parameters {
    constructor(
      public startPoint: Location,
      public endPoint: Location,
      public locats:Array<Location>,
      public transportations?: Array<string>,
      public freeHours?: number,
      public typesOfWay?: Array<string>,
      public placesToVisit?: number
    ) {}
  }