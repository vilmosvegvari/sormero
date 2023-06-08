import {Component, inject, OnInit} from '@angular/core';
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // @ts-ignore
  accelerometer: any;
  motion!: { x: number, y: number, z: number };

  ngOnInit(): void {

    // @ts-ignore
    this.accelerometer = new LinearAccelerationSensor();
    let resetted= true;
    this.accelerometer.addEventListener('reading', () => {
      this.motion = {x: this.accelerometer['x'], y: this.accelerometer['y'], z: this.accelerometer['z']};
      const z = Math.abs(this.accelerometer['z']);

      if(!resetted && z ===0){
        resetted = true;
      }
      if(resetted &&  z > 0.05){
        resetted = false;
        this.started? this.stop() : this.start();
      }
    });
    this.accelerometer.start();
  }

  ready =false;
  startTime!: number;
  started = false;

  date!: Date;

  sub: Subscription | null = null;

  start() {
    this.startTime = Date.now();
    this.started = true;
    this.sub = timer(0, 5).subscribe(val => {
      this.date = new Date(Date.now() - this.startTime)
    });
  }

  stop() {
    this.started = false;
    this.sub?.unsubscribe();
  }

}
