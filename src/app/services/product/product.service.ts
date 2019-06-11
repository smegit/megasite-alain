import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { _HttpClient } from '@delon/theme';


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
  constructor(
    private httpClient: HttpClient,
    private _httpClient: _HttpClient) { }

  // GET products 
  getProds(limit: string, offset: string): Observable<any> {
    console.info('getProds called');
    const options = {
      params: new HttpParams().set('limit', limit).set('offset', offset),
    };
    return this.httpClient.get(`${this.productsUrl}`, options);
  }

  // GET A Product
  getProduct(id): Observable<any> {
    return this._httpClient.get(`${this.productsUrl}/${id}`);
  }

  // CREAT product
  createProduct(payload): Observable<any> {
    return this._httpClient.post(`${this.productsUrl}`, payload);
  }
  // UPDATE product
  updateProduct(id, payload): Observable<any> {
    return this._httpClient.put(`${this.productsUrl}/${id}`, payload);
  }
  // DELETE the attachment associated to the product
  deleteItsAttachment(id, attachment_id): Observable<any> {
    return this._httpClient.delete(`${this.productsUrl}/${id}/attachment/${attachment_id}`);
  }

  // DELETE the product and the links to it and attachments associated but keep approvals
  deleteProd(id): Observable<any> {
    return this._httpClient.delete(`${this.productsUrl}/${id}`);
  }
}