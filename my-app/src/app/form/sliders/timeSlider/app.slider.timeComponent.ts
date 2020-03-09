import { Component } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'time-slider',
  templateUrl: './app.sliderComponent.html',
  styleUrls: ['./app.sliderComponent.scss']
})
export class TimeSliderComponent {
  value: number = 2;
  options: Options = {
    floor: 0,
    ceil: 24,
    showTicks: true
  };
}
