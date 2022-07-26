import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  Observable,
  fromEvent,
  switchMap,
  interval,
  Subscription,
  of,
  mergeMap,
  delay,
} from 'rxjs';

@Component({
  selector: 'app-transform',
  templateUrl: './transform.component.html',
  styleUrls: ['./transform.component.css'],
})
export class TransformComponent implements OnInit, AfterViewInit {
  @ViewChild('switchMapClick', { static: true })
  switchMapBtn!: MatButton;

  @ViewChild('clickLocation', { static: true }) clickLocation!: MatButton;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.switchMapforClick();
    this.saveClickLocations();
  }

  saveLocation = (location: Object): Observable<Object> => {
    // returns Observable object after 0.5s
    return of(location).pipe(delay(500));
  };

  switchMapforClick() {
    console.log(
      '[switchMapforClick] method invoked to attach the event listener'
    );
    const clickCounter: Observable<number> = fromEvent(
      this.switchMapBtn._elementRef.nativeElement,
      'click'
    ).pipe(switchMap(() => interval(1000)));
    // Restart counter on every click
    const clickCounterSubscription: Subscription = clickCounter.subscribe(
      (val) => console.log('Click Counter => ', val)
    );
  }

  switchMapOperator() {
    let sourceObservable: Observable<number> = of(1, 2, 3);
    let innerObservable: Observable<string> = of('a', 'b', 'c');

    sourceObservable
      .pipe(
        switchMap((val) => {
          console.log('Source Observable => ', val);
          console.log('Subscribing to Inner Observable!!');
          return innerObservable;
        })
      )
      .subscribe((value) => console.log('Inner Obs => ', value));
  }

  saveClickLocations() {
    console.log(
      '[saveClickLocations] method invoked to attach click event listener'
    );
    const clicks$: Observable<MouseEvent> = fromEvent(
      this.clickLocation._elementRef.nativeElement,
      'click'
    );

    clicks$
      .pipe(
        mergeMap((e: MouseEvent) => {
          // Fake network call
          return this.saveLocation({
            x: e.clientX,
            y: e.clientY,
            timeStamp: Date.now(),
          });
        })
      )
      .subscribe((val: Object) => {
        console.log('Location saved!!! => ', val);
      });
  }
}
