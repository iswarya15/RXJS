import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeyValuePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { TransformComponent } from './transform/transform.component';
import { ProductsComponent } from './products/products.component';
import { ProductsService } from './products/products.service';
import { SubjectComponent } from './subject/subject.component';
@NgModule({
  declarations: [AppComponent, TransformComponent, ProductsComponent, SubjectComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [KeyValuePipe, ProductsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
