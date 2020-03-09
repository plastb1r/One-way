export class Data {
  constructor(
    public photo: string,
    public name: string,
    public address: string,
    public index: number,
    public isAddedToWay: boolean = false,
    public isAddedToFav: boolean = false
  ) {}
}
