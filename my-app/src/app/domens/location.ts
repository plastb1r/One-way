export class Location {
  constructor(
    public lat: number,
    public lng: number,
    public placeId: string,
    public choose?: boolean,
    public addedToWay?: boolean
  ) {}
}
