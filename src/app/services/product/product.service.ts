import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

//import { Product } from '../../models/Product';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

const baseUrl = 'http://127.0.0.1:7001/api';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  productsUrl: string = `${baseUrl}/product`;
  constructor(private httpClient: HttpClient) { }

  // GET products 
  getProds(limit: string, offset: string): Observable<any> {
    console.info('getProds called');
    const options = {
      params: new HttpParams().set('limit', limit).set('offset', offset),
    };
    return this.httpClient.get(`${this.productsUrl}`, options);
  }
}