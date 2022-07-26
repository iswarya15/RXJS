import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(id: number) {
    console.log('Product ID => ', id);
    return this.http.get('../assets/data.json');
  }
}
