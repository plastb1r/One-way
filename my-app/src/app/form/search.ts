export class SearchWay {
  constructor(
    public id: number,
    public finance: number,
    public time: number,
    public transportTypes: Array<any>,
    public wayTypes: Array<any>,
    public searchPlace: string,
    public author: string,
    public startPoint: string,
    public endPoint: string,
    public amountOfPlaces: number
  ) {  }
}
