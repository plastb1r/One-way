import { Way } from 'src/app/domens/way';
import { Location } from 'src/app/domens/location';
export class User {
  constructor(
    public avatar: string,
    public name: string,
    public address: string,
    public e_mail: string,
    public phone_number: number,
    public twitter: string,
    public facebook: string,
    public login: string,
    public password: string,
    public ways: Array<Way>,
    public favPlaces: Array<Location>
    //places_id
  ) {}
}
