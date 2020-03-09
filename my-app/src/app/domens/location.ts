export class Location {
  constructor(
    public lat: number,
    public lng: number,
    public zoom: number,
    public placeId: string,
    public choose: boolean
  ) {}
}
