import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  takeWhile,
  filter,
  range,
  takeLast,
  first,
  skip,
  skipWhile,
  skipUntil,
  skipLast,
  scan,
  reduce,
  debounceTime,
  debounce,
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

  myForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
  });
  delay: number = 1000;

  constructor() {}

  ngOnInit(): void {
    this.myForm.controls.firstName.valueChanges
      .pipe(debounceTime(1000)) //only emits change after 1s
      .subscribe((data) => console.log('Form name value changed => ', data));

    this.myForm.controls.lastName.valueChanges
      .pipe(debounce(() => interval(this.delay))) //debounce takes in Observable which decides the delay
      .subscribe((value) =>
        console.log('Form LastName value chanhed => ', value)
      );
  }

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

  takeWhile() {
    const obs$: Observable<number> = of(1, 2, 3, 5, 1, 4, 3, 6, 3, 1); //values after first 3 is not emitted
    obs$.pipe(takeWhile((val) => val != 3)).subscribe({
      next: (val) => console.log('Value passing takeWhile condition =>', val),
      complete: () => console.log('TakeWhile discards rest of the stream'),
    });
  }

  takeWhileVsFilter() {
    const obs$: Observable<number> = of(1, 2, 3, 5, 1, 4, 3, 6, 3, 1); //values after 3 is still emitted
    obs$.pipe(filter((val) => val != 3)).subscribe({
      next: (val) => console.log('Value passing filter condition =>', val),
      complete: () => console.log('Filter does not discard the stream'),
    });
  }

  takeLastNValues() {
    const values$: Observable<number> = range(1, 100);

    values$
      .pipe(takeLast(5))
      .subscribe((val) => console.log('Last 5 values using takeLast =>', val));
  }

  firstValue() {
    const obs$: Observable<number> = of(1, 2, 3, 4, 5, 6).pipe(first());
    obs$.subscribe((val) => console.log('First value with no Condn =>', val));
  }

  firstValueWithCond() {
    const obs$: Observable<number> = of(1, 2, 4, 5, 6, 3).pipe(
      first((val) => val > 2)
    );

    obs$.subscribe((val) =>
      console.log('First value that matches condn =>', val)
    );
  }

  noValueMatchCondn() {
    const obs$: Observable<any> = of(1, 2, 3, 5).pipe(first((val) => val > 10));

    obs$.subscribe({
      next: (val) => console.log('Value that matches no condn', val),
      error: (err) => console.log('No values matched condn =>', err),
    });
  }

  defaultValue() {
    const obs$: Observable<any> = of(1, 2, 3, 5).pipe(
      first((val) => val > 10, 100)
    );

    obs$.subscribe({
      next: (val) => console.log('Default Value => ', val),
      error: (err) => console.log('No values matched condn =>', err),
    });
  }

  skipNValues() {
    const obs$: Observable<number> = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
      skip(5)
    );
    obs$.subscribe((val) => console.log('After Skipping n values =>', val));
  }

  skipWhileValues() {
    const obs$: Observable<number> = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
      skipWhile((val) => val < 5)
    );
    // Skips values if condn is met
    obs$.subscribe((val) => console.log('SkipWhile when vales < 5 => ', val));
  }

  skipUntilTimer() {
    const obs$: Observable<number> = interval(1000).pipe(
      skipUntil(timer(6000))
    );
    // Unlike takeUntil, skipUntil does not emit value till the notifier observable emits a value
    obs$.subscribe((val) =>
      console.log('Skip Values till Timer(6000s) emits => ', val)
    );
  }
  skipLastNValues() {
    const obs$: Observable<number> = range(1, 100).pipe(skipLast(90));
    // SkipLast delays the value. Use tap to check
    obs$.subscribe((val) => console.log('Skip Last N Values => ', val));
  }

  // When the second value arrives from source observable, the result of previous step becomes acc. The scan then emits a new value which becomes the acc for third input.
  scanValues() {
    const obs$: Observable<number> = of(1, 2, 3, 4, 5);

    obs$
      .pipe(scan((acc, val) => acc * val, 2)) //2 is the initial seed value (acc)
      .subscribe((val) => console.log('Scanned values => ', val)); //emits intermediatory result at each step
  }

  reduceValues() {
    const obs$: Observable<number> = of(1, 2, 3, 4, 5);

    obs$
      .pipe(reduce((acc, val) => acc + val, 0)) // 0 is the initial seed value(acc)
      .subscribe((val) => console.log('Reduce Final value => ', val)); //emits only the final value
  }
}
