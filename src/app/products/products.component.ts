import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params: Params) =>
          this.productsService.getProducts(params.get('id'))
        )
      )
      .subscribe((data) => {
        console.log('Products Data using [[SwitchMap]] => ', data);
      });
    // Without switchMap => Need to use 2 subscribes to return inner Observable

    this.activatedRoute.paramMap.subscribe((params: Params) => {
      this.productsService
        .getProducts(params.get('id'))
        .subscribe((data: any) =>
          console.log('Products Data without [[SwitchMap]] => ', data)
        );
    });
  }
}
