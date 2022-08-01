import { Component, OnInit } from '@angular/core';
import {
  AsyncSubject,
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit {
  subject$ = new Subject();
  constructor() {}

  ngOnInit(): void {}

  valuesBeforeSubs() {
    this.subject$.next(0); //0 is not received since subscription happens only after they emit values
    console.log('0 is lost since the subject$ is not yet subscribed');
    this.subject$.subscribe((val) =>
      console.log('Receiving from Subject => ', val)
    );

    this.subject$.next(1);
    this.subject$.next(2);
    this.subject$.complete();
  }

  subjectAsObserver() {
    const obs$: Observable<number> = new Observable(function subscribe(
      observer
    ) {
      observer.next(1);
      observer.next(2);
    });
    // subject$ implements next callback method. Hence can be used as observer within observable
    this.subject$.subscribe((val) =>
      console.log('Subject$ as Observer for Observable obs$ => ', val)
    );

    obs$.subscribe(this.subject$);
  }

  uniCastVsMultiCast() {
    const obs$: Observable<number> = new Observable((subscriber) => {
      subscriber.next(Math.random());
    });

    let sub$: Subject<any> = new Subject();

    obs$.subscribe(
      (val) => console.log('Unicast Observable Observable1  => ', val) // Different instance
    );

    obs$.subscribe(
      (val) => console.log('Unicast Observable Observable2  => ', val) // Different instance
    );

    obs$.subscribe((val) =>
      console.log('Unicast Observable Observable3  => ', val)
    );

    sub$.next(Math.random()); //not received since Subscription happens after emitting.

    sub$.subscribe(
      (val) => console.log('MultiCast Subject Subscriber1 => ', val) //share same instance with other subs
    );
    sub$.subscribe((val) =>
      console.log('MultiCast Subject Subscriber2 => ', val)
    );
    sub$.subscribe((val) =>
      console.log('MultiCast Subject Subscriber3 => ', val)
    );

    sub$.next(Math.random());
  }

  behaviorSubjectInit() {
    const subject$ = new BehaviorSubject(0);

    subject$.subscribe((val) => console.log('BehaviorSubject value => ', val)); //receives init value 0 followed by 1

    subject$.next(1);
    subject$.next(2);
    console.log('BehaviorSubject saves last value emitted by subject');

    // When new subscriber subscribes to the Subject, it receives the last emitted value.
    subject$.subscribe((val) =>
      console.log('BehaviorSubject Subscriber2 => ', val)
    );
  }

  replaySubjectDemo() {
    const sub$: Subject<any> = new ReplaySubject(); // Stores all the values in Buffer

    sub$.next(1);
    sub$.next(2);
    sub$.next(3);
    sub$.next(4);

    console.log('ReplaySubject defaults buffer to infinity');
    // Even though, subscription happens after the values are emitted, ReplaySubject stores the values in a buffer
    sub$.subscribe((val) => console.log('Subscription1 values => ', val)); //Subscription1

    sub$.next(5);
    sub$.next(6);

    console.log(
      'Subscription2 of ReplaySubject will receive latest values and all the values in buffer'
    );
    sub$.subscribe((val) => console.log('Subscription2 values => ', val));
  }

  replaySubjectBuffer() {
    const sub$: Subject<any> = new ReplaySubject(1); //Stores last 1 value in Buffer

    sub$.next(1);
    sub$.next(2);
    sub$.next(3);
    sub$.next(4);

    console.log('ReplaySubject Buffer limit set to 1');
    // Even though, subscription happens after the values are emitted, ReplaySubject stores the values in a buffer
    sub$.subscribe((val) => console.log('Subscription1 values => ', val)); //Subscription1

    console.log('New Values');
    sub$.next(5);
    sub$.next(6);

    console.log(
      'Subscription2 of ReplaySubject will also receive the same number of values set by Buffer'
    );
    sub$.subscribe((val) => console.log('Subscription2 values => ', val));
  }

  asyncSubjectDemo() {
    const sub$: Subject<any> = new AsyncSubject();

    sub$.next(1); //not emitted since no complete notif is sent
    sub$.next(2); //not emitted since no complete notif is sent

    sub$.subscribe({
      next: (val) => console.log('Subscription1 value => ', val),
      error: (err) => console.log(err),
      complete: () => console.log('Subscription1 complete'),
    });

    // Subs1 receives 5 and complete notif, only then subs2 receives 5 & complete
    sub$.next(4);
    sub$.next(5); //latest value 5 emitted since complete notif is sent
    sub$.complete();

    sub$.subscribe({
      next: (val) => console.log('Subscription2 value => ', val),
      complete: () => console.log('Subscription2 completes'),
    });

    sub$.error('Error'); // No values are emitted after this
    sub$.next(6);

    sub$.subscribe({
      next: (val) => console.log('Subscription3 value => ', val),
      complete: () => console.log('Subscription3 completes'),
    });
  }
}
