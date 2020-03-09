import { Component} from '@angular/core';
import { SearchWay } from './search';

@Component({
  selector: 'search-form',
  templateUrl: './form.html',
  styleUrls: ['./app.formComponent.css']
})
export class FormComponent{

  transportTypes = ['На автобусе', 'На метро',
            'Пешком', 'На машине'];

  wayTypes = ['Активный', 'По историческим местам',
            'По достопримечатльностям','Велосипедная прогулка',
            'Гастрономический гид', 'Культурный', 'По святым местам'];

  submitted = false;
  hours = [1, 2,
            3,4,
            5, 6, 10, 12, 16, 20, 24];
  finance=0;
  author= "";
  startPoint="";
  endPoint="";
  amountOfPlaces=0;
  model = new SearchWay(0,0,this.hours[0],this.transportTypes,this.wayTypes,"","", "", "", 0);
  private _opened: boolean = false;
  onSubmit()
  {
    this.submitted = true;
  }

  _toggleOpened(): void {
    this._opened = !this._opened;
  }
}
