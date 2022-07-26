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
  take,
  timer,
  takeUntil,
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
  @ViewChild('firstClick', { static: true }) firstClick!: MatButton;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.switchMapforClick();
    this.saveClickLocations();
    this.firstClickLocation();
  }

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

  saveLocation = (location: Object): Observable<Object> => {
    // returns Observable object after 0.5s
    return of(location).pipe(delay(500));
  };

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

  takeOneValue() {
    const obs: Observable<number> = of(1, 2, 3, 4, 5, 6);

    obs.pipe(take(2)).subscribe({
      next: (val) => console.log('Value Emitted by Take => ', val),
      complete: () => console.log('Source Emission Complete'),
    });
  }

  filterInterval() {
    const obs: Observable<number> = interval(1000);

    obs
      .pipe(take(5))
      .subscribe((val) => console.log('Value Emitted by Interval =>', val));
  }

  firstClickLocation() {
    const firstClick = fromEvent(
      this.firstClick._elementRef.nativeElement,
      'click'
    );

    firstClick
      .pipe(
        switchMap((event: any) => {
          return this.saveLocation({
            x: event.clientX,
            y: event.clientY,
          });
        }),
        take(1) //placing the take operator above switchMap doesn't filter any emission from switchMap. Hence place it after switchMap
      )
      .subscribe((val) => console.log('First Click Location', val));
  }

  takeUntilTimer() {
    const obs$: Observable<number> = interval(1000); // Values after 4s aren't emitted since takeUntil emits a value at 5th second
    // Timer$ emits 0 at 5s and completes since it doesn't have any second param
    const timer$: Observable<number> = timer(5000);

    const timerSubs: Observable<number> = obs$.pipe(takeUntil(timer$)); //takes until timer$ emits a value. timer$ is the notifiable observable

    timerSubs.subscribe({
      next: (val) => console.log('TakeUntil timer emits => ', val),
      complete: () => console.log('Stopped by TakeUntil Timer'),
    });
  }
}
