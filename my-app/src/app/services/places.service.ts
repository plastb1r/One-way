import {TokenStorageService} from '../_services/token-storage.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export class PlacesService {
  private placesUrl: string;
  currentUser: any;
  constructor(
    private http: HttpClient,
    private token: TokenStorageService
  ) {
    this.currentUser = this.token.getUser();
    this.placesUrl = 'http://localhost:8181/api/auth/places';
// this.listToDoUrl = "http://localhost:8080/api/auth/" + this.currentUser.id +"/places/";
  }
    getById(id): Observable<Location> {
      return this.http.get<Location>(this.placesUrl + '/' + id);
  }

    addList(list: Location) {
      return this.http.put<Location>(this.placesUrl, list);
    }

    deleteById(id: number) {
      return this.http.delete(this.placesUrl + '/' + id);
    }

    getAll(): Observable<Location[]> {
      return this.http.get<Location[]>(this.placesUrl);
    }
}
