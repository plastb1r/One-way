import { PlaceCount } from './place_count';

export class WayType {
    constructor(
      public name: string,
      public types: Array<string>,
      public selected: boolean,
      public places_count: number
    ) {}
  }
  