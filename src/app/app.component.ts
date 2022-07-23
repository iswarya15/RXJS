import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  of,
  from,
  fromEvent,
  Subscription,
  debounceTime,
  filter,
  map,
  Observer,
  tap,
  pipe,
  switchMap,
  interval,
} from 'rxjs';
import { MatButton } from '@angular/material/button';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'RXJS';
  observable!: Observable<string>;

  // this.obsButton._elementRef.nativeElement => returns the MatButton : Pass this as first argument to the fromEvent method
  @ViewChild('obsButton', { static: true }) obsButton!: MatButton;
  buttonSubscription!: Subscription;
  @ViewChild('switchMapClick', { static: true }) switchMapBtn!: MatButton;
  customPipeForOfOperator!: Subscription;

  @ViewChild('debounceButton') deBounceBtn!: MatButton;

  constructor(private http: HttpClient, private keyValuePipe: KeyValuePipe) {}

  ngOnInit(): void {
    // Callback function inside Observable constructor is executed when this Observable's subscribe method is called.
    this.observable = new Observable(function subscribe(subscriber) {
      subscriber.next('1');
      subscriber.next('2');

      subscriber.error('Manual Error');
      subscriber.complete(); //never executed
    });

    // We have 3 optional callbacks -> next(), error(), complete()
    this.observable.subscribe({
      next: (value) =>
        console.log('Emitted from Constructor. Value => ', value),
      error: (error) =>
        console.log('**Error occurred at [[ngOnInit]] **', error),
      complete: () => console.log('Stream Completed'),
    });

    const http$: Observable<any> = this.http.get('assets/data.json');

    http$.subscribe({
      next: (res) => console.log('HTTP Response => ', res),
      error: (error) => console.log('HTTP Error => ', error),
      complete: () => console.log('HTTP Request Complete'),
    });
  }

  ngAfterViewInit(): void {
    // @ViewChild will not initialize obsButton till the view is set up.
    this.buttonClick();
    this.debounceBtnClick();
    this.scroll();
    this.switchMapforClick();
  }

  creationOperators() {
    // Using constructor
    const obsUsingConstructor: Observable<number> = new Observable(
      (subscriber: Observer<number>) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.complete();
      }
    );
    obsUsingConstructor.subscribe({
      next: (val) => console.log('Constructor  =>', val),
      error: (error) => console.log(error),
      complete: () => console.log('Stream completed using Constructor'),
    });

    // Using of Operator
    const obsUsingOf: Observable<string> = of('hi', 'Good', 'Morning');

    obsUsingOf.subscribe({
      next: (val) => console.log('From Of Operator => ', val),
      complete: () => console.log('Stream completed using Of Operator'),
    });

    const observableArrayUsingOf: Observable<string[]> = of(
      ['this', 'is', 'arr1'],
      ['this', 'is', 'arr2']
    );

    observableArrayUsingOf.subscribe({
      next: (arr) => console.log('Array from Of Operator', arr),
      complete: () =>
        console.log('Stream of Array completed using Of Operator'),
    });

    const observableDiffTypesUsingOf: Observable<any> = of(
      'hi',
      [1, 2, 4],
      true
    );

    observableDiffTypesUsingOf.subscribe({
      next: (val) =>
        console.log(
          'Stream of different Data Types emitted using Of Operator',
          val
        ),
      complete: () =>
        console.log('Stream of different types completed using Of operator'),
    });

    // Using From operator
    const observableUsingFrom: Observable<string> = from(['a', 'b', 'c']);

    observableUsingFrom.subscribe({
      next: (val) => console.log('Emitted using from Operator =>', val),
      complete: () =>
        console.log('Stream of array completed using from operator '),
    });

    let myMap = new Map();
    myMap.set(0, 'Map Element 1');
    myMap.set(1, 'Map Element 2');
    // Type => [0, 'Map Element 1'] so <[number, string]>
    const collectionObsUsingFrom: Observable<[number, string]> = from(myMap);

    collectionObsUsingFrom.subscribe({
      next: (val) => console.log('Collection Observable => ', val),
      complete: () =>
        console.log('Stream of Collection completed using From Operator'),
    });
  }

  // Create Observable from Events using FromEvent
  buttonClick() {
    console.log('[buttonClick] method invoked to attach the event listener');
    // FromEvent method registers the event handler to the DOM Element using addEventListener under the hood
    this.buttonSubscription = fromEvent(
      this.obsButton._elementRef.nativeElement,
      'click'
    ).subscribe({
      next: (res) =>
        console.log(
          'Event Button Click listened using FromEvent Operator:  =>',
          res
        ),
    });
  }

  debounceBtnClick() {
    console.log(
      '[debounceBtnClick] method invoked to attach the event listener'
    );
    fromEvent(this.deBounceBtn._elementRef.nativeElement, 'click')
      .pipe(debounceTime(1000))
      .subscribe((val) =>
        console.log('Debounce event delays the notification by 1s')
      );
  }

  scroll() {
    const scrollEvent = fromEvent(window, 'scroll');
    scrollEvent.subscribe((res) =>
      console.log('Window scroll Listened using [fromEvent] ', res)
    );
  }

  pipeOperatorsUsingFilterMap() {
    const observable: Observable<number> = new Observable(
      (subscriber: Observer<number>) => {
        subscriber.next(1),
          subscriber.next(2),
          subscriber.next(3),
          subscriber.next(4),
          subscriber.next(5),
          subscriber.complete();
      }
    ).pipe(
      filter((data) => {
        console.log('Data at Filter => ', data); //1 2 3 4 5
        return data > 2;
      }),
      map((val) => val * 2)
    );
    observable.subscribe({
      next: (val) => console.log('Received from Operators in Pipe ', val),
      complete: () =>
        console.log('Stream of values greater than 2 using Pipe completed'),
    });
  }

  tapObservables() {
    const observable: Observable<number> = new Observable(
      (subscriber: Observer<number>) => {
        subscriber.next(1),
          subscriber.next(2),
          subscriber.next(3),
          subscriber.next(4),
          subscriber.next(5),
          subscriber.complete();
      }
    ).pipe(
      tap((data) => console.log('Tap data => ', data)),
      filter((data) => {
        console.log('Data at Filter => ', data); //1 2 3 4 5
        return data > 2;
      }),
      map((val) => val * 2),
      tap((data) => console.log('Tap data after mapping =>', data))
    );
    observable.subscribe({
      next: (val) => console.log('Received from Operators in Pipe ', val),
      complete: () =>
        console.log(
          'Stream of values by tapping and mapping using Pipe completed'
        ),
    });
  }

  reusablePipe() {
    const customOperator = pipe(
      tap((data: any) => console.log('tap ' + data)),
      filter((data) => data > 2),
      tap((data) => console.log('filter ' + data)),
      map((val) => {
        return val * 2;
      }),
      tap((data) => console.log('final tap ' + data))
    );

    const observable: Observable<number> = new Observable(
      (subscriber: Observer<number>) => {
        subscriber.next(1),
          subscriber.next(3),
          subscriber.next(4),
          subscriber.complete();
      }
    );

    observable.pipe(customOperator).subscribe({
      next: (data) =>
        console.log('Subscribing to Values received from CustomPipe => ', data),
      complete: () => console.log('Stream completed from customPipe'),
    });

    this.customPipeForOfOperator = of(1, 5, 6, 7)
      .pipe(customOperator)
      .subscribe((val) =>
        console.log(
          'of Operator Values received from CustomPipe method => ',
          val
        )
      );
  }

  mapOperator() {
    const srcArray: Observable<number> = from([1, 2, 3, 4]);

    srcArray.pipe(map((val) => val * 3)).subscribe({
      next: (val) => console.log('Value from Map operator =>', val),
      complete: () => console.log('Stream completed through map Operator'),
    });
    console.log('Use index param for map()');
    srcArray.pipe(map((val, index) => val * index)).subscribe({
      next: (val) => console.log('Map operator using index => ', val),
      complete: () => console.log('Stream completed through Map Operator'),
    });
  }

  toUpperCaseUsingMap() {
    const input: Observable<string> = from(['Jin Yang', 'Richard', 'Gilfoyle']);

    input
      .pipe(map((name) => name.toUpperCase()))
      .subscribe((name) => console.log('Converted name to Uppercase: ', name));
  }

  mapFirstandLastName() {
    const name: Observable<object> = of({
      fname: 'steve',
      lname: 'Harrington',
    });

    name
      .pipe(map((person: any) => person.fname + ' ' + person.lname))
      .subscribe((name) => console.log('Person name mapped : ', name));
  }

  $getDogsList() {
    return this.http.get<any>('https://dog.ceo/api/breeds/list/all');
  }

  mapHttpRequest() {
    this.$getDogsList()
      .pipe(
        map((data: any) => {
          var dogs = this.keyValuePipe.transform(data.message);
          console.log(dogs);
        })
      )
      .subscribe();

    const obj = { person1: 'jon', person2: 'hopper', person3: 'mona' };
    const transformObj = this.keyValuePipe.transform(obj);
    console.log(transformObj);
  }

  multipleMaps() {
    const obs: Observable<number> = from([1, 2, 3]);
    obs
      .pipe(
        map((val) => val + 10),
        map((val) => val * 2)
      )
      .subscribe((data) => console.log('Using 2 Map Operators ', data));
  }

  filterOperator() {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        filter((num) => num % 2 == 0),
        tap((num) => {
          console.log('Tap num => ', num);
          return num * 10; // does not modify the stream
        })
      )
      .subscribe({
        next: (val) => console.log('Filter Even numbers => ', val),
        complete: () => console.log('Filtering completed'),
      });
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

  switchMapforClick() {
    console.log(
      '[switchMapforClick] method invoked to attach the event listener'
    );
    const clickCounter: Observable<number> = fromEvent(
      this.switchMapBtn._elementRef.nativeElement,
      'click'
    ).pipe(switchMap(() => interval(1000)));
    // Cancels any counter started for previous clicks!
    const clickCounterSubscription: Subscription = clickCounter.subscribe(
      (val) => console.log('Click Counter => ', val)
    );
  }

  ngOnDestroy() {
    // When we unsubscribe, it un-registers the event handler from the DOM element.
    this.buttonSubscription.unsubscribe();
    this.customPipeForOfOperator.unsubscribe();
  }
}
