import { Component } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'finance-slider',
  templateUrl: './app.sliderComponent.html',
  styleUrls: ['./app.sliderComponent.scss']
})
export class FinanceSliderComponent {
  value: number = 500;
  options: Options = {
    floor: 0,
    ceil: 10000,
    step: 100,
  };
}
