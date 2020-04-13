import {TokenStorageService} from '../_services/token-storage.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Way} from '../domens/way';

export class RoutesService {
  private routeUrl: string;
  currentUser: any;
  constructor(
    private http: HttpClient,
    private token: TokenStorageService
  ) {
    this.currentUser = this.token.getUser();
    this.routeUrl = 'http://localhost:8181/api/auth/routes';
// this.listToDoUrl = "http://localhost:8080/api/auth/" + this.currentUser.id +"/routes/";
  }
  getById(id): Observable<Way> {
    return this.http.get<Way>(this.routeUrl + '/' + id);
  }

  addList(list: Way) {
    return this.http.put<Location>(this.routeUrl, list);
  }

  deleteById(id: number) {
    return this.http.delete(this.routeUrl + '/' + id);
  }

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.routeUrl);
  }
}
