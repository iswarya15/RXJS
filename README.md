# RXJS

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.

`Rx` stands for **Reactive Programming** which refers to _Programming with asynchronous data streams_.

### What is a data stream?

A stream is a data which arrives over a period of time. The stream of data can be anything like variables, user inputs, cache,
data structures, etc

At any point, data stream may emit any of the following three events:

- Value : The next value in the stream.
- Error : The stream has ended.
- Complete : The error has stopped the stream or data stream is over.

## Reactive Programming

The `Reactive Programming` is all about creating streams, emitting values, error or complete notifications, manipulate and transform data.

## Rxjs

The `Rxjs (Reactive Extensions Library for Javascript)` is a Javascript library, that allows us to work with Asynchronous data streams.

## Rxjs in Angular

Angular uses `RXJS` library heavily in its framework to implement Reactive Programming. For example,

- Reacting to an `HTTP` Request in Angular, i.e. by subscribing.
- **Value Changes / Status Changes** in Reactive forms.
- Custom events that send Observable output data from child component to a parent component

## Observables and Observers

`Observables`: is a function that emits single or multiple values over time either **synchronously** or **asynchronously**.

`Observers`: `Observables` on its own is useless unless someone consumes the value emitted by the Observable. We call them
`Observers` or `Subscribers`.

### Observable Creation

- Simplest way to create Observable is using the Observable `constructor`. The Observable `constructor` takes an argument
  for its callback function (subscriber - argument).This callback function will run when this `Observable's subscribe` method executes.

- `next()` : The observable invokes the `next()` callback whenever a value arrives in the stream. It passes the value as an
  `argument` to this `callback`.

- `error()` : Sends JS Error / Exception as argument. No further value is emitted. Stream stops.

- `complete()` : Observable invokes this when stream completes. After emitting the complete() notification, no value is emitted
  to the subscriber after that.

`Syntax` : let obs = new Observable(subscriber => {
console.log('Start emitting');
subscriber.next('Hi')
});

There are _easier_ ways to create Observables using **Rxjs Operators**.

### Subscribing to Observables

The `Observers` communicate with the `Observable` using `callbacks`. While _subscribing_ to the `Observable`, it passes
three **optional** callbacks. We can pass these callbacks within an Object as an argument for `subscribe()` method. If we are expecting only the `value` emitted by the `Observable`, then it can be passed without the Object syntax.

Check `app.component.ts` for implementation of `subscribing` to `Observables`.

## Observable Operators

The `Operators` are functions that operate on the Observables and return **a new Observable**. We can manipulate incoming observable, filter it,
merge it with another Observable or subscribe to another Observable.

We can also _chain_ each operator one after the other using the **pipe**. Each operator in the chain gets the Observable from the previous
operator. It modifies it and creates new Observable, which becomes the input for next Operator.

The following table lists some of the commonly used Operators.

| Operation      | Operators                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Combination    | combineLatest, concat, merge, startWith , withLatestFrom, zip                                                                               |
| Filtering      | debounceTime, distinctUntilChanged, filter, take, takeUntil, takeWhile, takeLast, first, last, single, skip, skipUntil, skipWhile, skipLast |
| Transformation | bufferTime, concatMap, map, mergeMap, scan, switchMap, ExhaustMap, reduce                                                                   |
| Utility        | tap, delay, delaywhen                                                                                                                       |
| Error Handling | throwerror, catcherror, retry, retrywhen                                                                                                    |
| Multicasting   | share                                                                                                                                       |

## Creation Operators

- `Observable.create()` -> Calls the Observable `Constructor` behind the scenes. Create is a method of the Observable object, hence
  don't have to import it. This method is _deprecated_. Use constructor instead.

- `of` creates an Observable from the `arguments` we pass into it. We can pass _any number of arguments_ to the `Of`. Each argument is emitted _one after the other_. It sends the `complete` signal in the end.

- `from` operates creates takes only `one argument` that can be iterated and converted into an `Observable`. Sends `complete` signal in the end.

Example Array: from([a,b,c]) => a->b->c->complete
Example String: from('Hello') => 'h'->'e'->'l'->'l'->'o' -> complete.

- `Observables from collections` : **Anything** that can be `iterated` can be converted into an `Observable` using `from` operator.

## Observables from Event

- `FromEvent` method allows us to create an **Observable** from `DOM events` directly.

- `Arguments` : _EventTargetElement_: First, _EventName_: Second

Syntax :

```
fromEvent(this.button.nativeElement, 'click').subscribe({next: () => {}, complete: () => {}})
```

### How it works?

When we `subscribe` to an `observable`, which we created using the `fromEvent` method, it _registers_ the **event handler** using the `addEventListener` in the DOM element

## Pipe method

`Pipe` method of Angular Observable is used to _chain multiple operators_ together. `Rxjs Operators` are functions that take Observables as Input and `transform` it into a new `Observable` and return it.

Each argument of the `pipe` method must be separated by a `comma`. The _order of operators_ is important because when a user subscribes to an Observable, the pipe executes in the order in which they are added.

There are **2** ways, we can use the pipe. One as an `instance` of `Observable` and the other way is to use it as a `standalone` method.

### Pipe as an instance method

We chain the operators op1, op2 etc that are passed as argument to the `pipe` method. The output of op1 becomes the Input of op2.

```
obs.pipe(
  op1(),
  op2(),
  op3(),
)
```

**Note**: If we are emitting _multiple values_ through `operators` in the `pipe chain`, each observable would go through the _entire chain_ and will be delivered to the subscriber, only then the next one will be streamed.

Refer `pipeOperatorsUsingFilterMap()` method.

### Pipe as standalone method

We can also use pipe as a standalone function and `re-use` the **pipe at other places**. We need to import _pipe_ from rxjs. Check `reusablePipe` method for custom pipe creation.

## tap Operator

`tap` : The tap operator returns a new Observable which is the _mirror copy_ of the source `observable`. Mostly used for _debugging purpose_. It does not modify the stream in any way.

Example: _Logging_ the values of Observables. Refer `tapObservables()` method

## map Operator

`map` : can be used with HTTP Request, with DOM Events, filtering the input data etc..

- `Arguments` map(value : _emitted_ by the observable ,index: _0 for the first value emitted_ and _incremented by one_ for every subsequent value) optional.

**Note** : `keyValue` _pipe_ from `@angular/common` can _transform an Object to Array of key-value pairs_

```
const obj = {person1: 'jon',person2: 'hopper',person3: 'mona'}
const transformObj = this.keyValuePipe.transform(obj);
```

Result :
[
{
"key": "person1",
"value": "jon"
},
{
"key": "person2",
"value": "hopper"
},
{
"key": "person3",
"value": "mona"
}
]

- We can also use `multiple maps` within same `pipe`.

## Filter operator

-Most widely used operator which can filter items emitted based on a condition.

## Transformational Operator

## SwitchMap Operator

`SwitchMap` operator `maps` each value from the `source observable` to an `inner observable`. The _source observable subscribes_ to the `inner observable` and emits value from it.

`SwitchMap` function must return an **Observable**

### Map vs SwitchMap

`map` _emits values_ as `Observables`, `switchMap` _subscribes to an Inner Observable_ and emits values from it.

```
someStream$.pipe(
    switchMap(args => makeApiCall(args)), // must return a stream
    map(response => process(response)) // returns a value of any shape, usually an object or a primitive
).subscribe(doSomethingWithResults);
```

`Example use case`: This works perfectly for scenarios like form Input/search Input where you are _no longer concerned with the response of the previous request when a new input arrives_.

The main difference between _switchMap and other flattening operators_ is the **cancelling effect**. On each emission the previous inner observable (the result of the function you supplied) is cancelled and the new observable is subscribed. You can remember this by the phrase **switch to a new observable**.

## MergeMap Operator

This operator is best used when you wish to `flatten` an `inner observable` but want to _manually control the number of inner subscriptions_.

In contrast to `SwitchMap`, mergeMap **allows for multiple inner subscriptions** to be active at a time.
If the order of emission and subscription of inner observables is important, try `concatMap`. `SwitchMap` never cancels inner Observable.

`Memory Leaks` : Using `mergeMap` operator can often lead to memory leaks since it allows multiple inner subscriptions, so make sure to use Operators like `take`, `takeUntil`

## Filtering Operators

## take Operator

Why use `take`?

- When you are interested in only the `first emission`, you want to use take. Maybe you want to _see what the user first clicked on when they entered the page_, or you would want to _subscribe to the click event and just take the first emission_.

* Another use-case is when you need to _take a snapshot of data at a particular point in time but do not require further emissions_. For example, a stream of user token updates, or a route guard based on a stream in an Angular application.

  💡 If you want to **take a number of values based on some logic**, or another observable, you can use **takeUntil** or **takeWhile**!
  💡 `take` is the _opposite_ of `skip` where take will _take the first n number of emissions while skip will skip the first n number of emissions_.

```
 obs.pipe(take(2)).subscribe()
```

## TakeUntil Operator

The `takeUntil` operator returns an `Observable` that emits value from the `source Observable` until _the `notifier Observable` emits a value_.

```
TakeUntil(notifier: Observable): Observable
```

We must pass a **notifier observable** as the `argument` to the `TakeUntil Operator`.

- TakeUntil emits the values from the Source Observable as long as it does not receive any value from the notifier observable.

- When the notifier emits a value, the TakeUntil completes the Source observable.

Check sample code in `transform.component.ts`

## TakeWhile vs Filter

`TakeWhile` operator will keep emitting the value from the source observable until they pass the given condition (predicate). When it receives a value that _does not satisfy the condition_ it _completes the observable_.

The difference is that takeWhile _discards the rest of the stream, when it receives the first value that does not satisfy the condition_. The filter operator **never stops the observable**.

## TakeLast

`TakeLast` operator emits the `last n number of values` from the source observable.

## First / Last

`first/last` operator _emits the first/last matching value if the condition is present_.If there is no condition present, it emits th first/last value it receives.

`Error` _notification_ is sent if no value is emitted from `source`.

## Skip Operators

The skip operators **skips the values** from the source observable based on a `condition`. The `Skip`, `SkipUntil`, `SkipWhile` skips the values from the _start of the source_. The `SkipLast` Operator skips elements from the _end of the source_.

### Filter vs SkipWhile

- `Filter` emits the value if the predicate(condn) is true
- `SkipWhile` skips the value if the predicate(condn) is true

## Subjects

`Subjects` are special Observable which acts as both `Observer` and `Observable`. They allow us to `emit` new values to the `Observable` stream using the `next` method.

- All the `subscribers`, who subscribe to the `subject` will _receive the same instance of the subject & hence the same values_.

* A `Subject` is a special type of `Observable` which allows values to be `multi-casted` to many `observers`.

### How does Subjects work?

`Subject` implements _both_ `subscribe` method and `next`, `error` and `complete`.

### Creating Subject

```
subject$ = new Subject();
```

### Subscribing & Emitting: Subject

```
ngOnInit() {
  this.subject$.subscribe(val => console.log(value))

  this.subject$.next(1);
  this.subject$.next(2);
  this.subject$.complete();
}
```

## Subject - Hot Observable

`Observables` are classified into two groups.

- Cold Observable
- Hot Observable

### Cold Observable

The `cold` observable _*does not activate the producer*_ until there is a `subscriber`. The `producer` emits the value only when a subscriber subscribes to it.

### Hot Observable

The `Hot` observable _does not wait for a `subscriber` to emit the data_. It can start emitting the values right away.

```
subject$ = new Subject();

ngOnInit() {
  subject$.next(1);
  subject$.next(2);
  subject$.complete();
}
```

In the above example, since there were no `subscribers`, no one receives the data but that did not _*stop the subject from emitting data*_.

Now consider the following example. Here the subjects that emits the _values 1 & 2 are lost_ because **subscription happens after they emit values**.

```
ngOnInit() {
  subject$.next(1);
  subject$.next(2);

  subject$.subscribe(val => console.log(val));

  subject$.next(3);
  subject$.next(4);
  subject$.complete();
}
```

## Every Subject is an Observer

`Observer` needs to implement `next`, `error`, `complete` callback (all optional) to become an `Observer`.

```
let obs$ = new Observable(observer => {
  observer.next(1);
  observer.error('error');
})

this.subject$.subscribe(val => {
      console.log(val);
});

obs$.subscribe(subject$);
```

Since the `subject$` implements `next` method, it receives the value from `observable` and emits them to `subscribers`. So _we can subscribe to observable and use `subject$` as `observer`_.

## Subjects are MultiCast

Another important distinction between `observable` and `subject` is that `Subjects` are `multi cast`.

- More than _one subscriber can subscribe to a Subject_. They will `share` the **same instance** of the observable. All subscribers will receive the _same event_ when the Subject emits it.

* Multiple `observers` of an `observable` will receive a **separate instance** of the `observable`.

## MultiCast vs UniCast

Check `uniCastVsMultiCast` method in `subject.component.ts`.

## Subject maintains a list of Subscribers

Whenever `subscriber` subscribes to a `Subject`, it will add it to an _array of `Subscribers`_. This way `Subject` keeps track of all the `subscribers` and emits the `event` to all of them.

## Types of Subject

- BehaviorSubject
- ReplaySubject
- AsyncSubject

## BehaviorSubject

`BehaviorSubject` requires an `initial value` and _stores the current value and emits it to the new subscribers_.

```
subject$ = new BehaviorSubject(0);

subject$.subscribe(val => console.log(val)); //0

subject$.next(1);
```

`BehaviorSubject` will always _remembers the last emitted value_ ans shares it with new `subscribers`.

## ReplaySubject

`ReplaySubject` replays old values to new `Subscribers` when they _first subscribe_.

- The `ReplaySubject` will _store every value it emits in a buffer_. We can configure the `buffer arguments` using the `bufferSize` and `windowTime`.

`bufferSize` : No. of items that `ReplaySubject` will keep in its _buffer_. It _defaults_ to _infinity_.

`windowTime` : The _amount of time_ to keep the value in the buffer.

Even when **subscription happens after the values are emitted**, ReplaySubject stores the values in a buffer.

## AsyncSubject

`AsyncSubject` only emits the _latest value when it completes_. If it errors out, then it will emit an error, but will not emit anymore values.

Check `asyncSubjectDemo` method in `subject.component.ts`
