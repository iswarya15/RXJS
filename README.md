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
If the order of emission and subscription of inner observables is important, try `concatMap`.

`Memory Leaks` : Using `mergeMap` operator can often lead to memory leaks since it allows multiple inner subscriptions, so make sure to use Operators like `take`, `takeUntil`
