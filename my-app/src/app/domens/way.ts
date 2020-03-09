import { Location } from 'src/app/domens/location';
export class Way {
  constructor(
    public index: number,
    public points: Array<Location>,
    public cityAddress: string,
    public name: string
  ) {}
}
