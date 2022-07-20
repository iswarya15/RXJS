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
} from 'rxjs';
import { MatButton } from '@angular/material/button';

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

  @ViewChild('debounceButton') deBounceBtn!: MatButton;

  constructor(private http: HttpClient) {}

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

    this.creationOperators();
  }

  ngAfterViewInit(): void {
    // @ViewChild will not initialize obsButton till the view is set up.
    this.buttonClick();
    this.debounceBtnClick();
    this.scroll();
  }

  creationOperators() {
    // Using constructor
    const obsUsingConstructor: Observable<any> = new Observable(
      (subscriber: any) => {
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

  ngOnDestroy() {
    // When we unsubscribe, it un-registers the event handler from the DOM element.
    this.buttonSubscription.unsubscribe();
  }
}
