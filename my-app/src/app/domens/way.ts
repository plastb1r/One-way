
import { PlaceOnRoute } from './placeOnRoute';
export class Way {
  constructor(
    public name: string,
    public timeToGo: number, 
    public places: Array<PlaceOnRoute>,
    public city: string,
    public id?: number,
  ) {}
}
