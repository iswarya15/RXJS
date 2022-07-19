import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'RXJS';
  observable!: Observable<string>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Callback function inside Observable constructor is executed when this Observable's subscribe method is called.
    this.observable = new Observable(function subscribe(subscriber) {
      console.log('Start Emitting!');
      subscriber.next('1');
      subscriber.next('2');

      subscriber.error('Manual Error');
      subscriber.complete(); //never executed
    });

    // We have 3 callbacks -> next(), error(), complete()
    this.observable.subscribe(
      (value) => console.log('Value => ', value),
      (error) => console.log('**Error occurred at [[ngOnInit]] **', error),
      () => console.log('Stream Completed')
    );

    const http$ = this.http.get('assets/data.json');

    http$.subscribe(
      (res) => console.log('HTTP Response => ', res),
      (error) => console.log('HTTP Error => ', error),
      () => console.log('HTTP Request completed')
    );
  }
}
