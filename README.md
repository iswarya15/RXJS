# RXJS

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.

`Rx` stands for **Reactive Programming** which refers to _Programming with asynchronous data streams_.

### What is a data stream?

A stream is a data which arrives over a period of time. The stream of data can be anything like variables, user inputs, cache,
data structures, etc

At any point, data stream may emit any of the following three events:

- Value : The next value in the stream.
- Error : The stream has ended.
- Complete : The error has stopped the stream.

## Reactive Programming

The `Reactive Programming` is all about creating streams, emitting values, error or complete notifications, manipulate and transform data.

## Rxjs

The `Rxjs (Reactive Extensions Library for Javascript` is a Javascript library, that allows us to work with Asynchronous data streams.

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
three **optional** callbacks.

Check `app.component.ts` for implementation of `subscribing` to `Observables`.

## Observable Operators

The `Operators` are functions that operate on the Observables and return **a new Observable**. We can manipulate incoming observable, filter it,
merge it with another Observable or subscribe to another Observable.

We can also _chain_ each operator one after the other using the **pipe**. Each operator in the chain gets the Observable from the previous
operator. It modifies it and creates new Observable, which becomes the input for next Operator.

The following table lists some of the commonly used Operators.

| Area           | Operators                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Combination    | combineLatest, concat, merge, startWith , withLatestFrom, zip                                                                               |
| Filtering      | debounceTime, distinctUntilChanged, filter, take, takeUntil, takeWhile, takeLast, first, last, single, skip, skipUntil, skipWhile, skipLast |
| Transformation | bufferTime, concatMap, map, mergeMap, scan, switchMap, ExhaustMap, reduce                                                                   |
| Utility        | tap, delay, delaywhen                                                                                                                       |
| Error Handling | throwerror, catcherror, retry, retrywhen                                                                                                    |
| Multicasting   | share                                                                                                                                       |
