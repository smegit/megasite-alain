import { environment } from "../../../environments/environment";
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable, Observer } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class FunService {
  funUrl: String = `${baseUrl}/fun`;
  constructor(
    private _httpClient: _HttpClient,
  ) { }

  // get categories
  getFuns(limit: string, offset: string, query: any): Observable<any> {
    const options = {
      limit: limit,
      offset: offset,
      query: query
    };
    return this._httpClient.get(`${this.funUrl}`, options);
  }

  // create new category
  createFun(payload): Observable<any> {
    return this._httpClient.post(`${this.funUrl}`, payload);
  }

  // update existing fun
  updateFun(id, payload): Observable<any> {
    return this._httpClient.put(`${this.funUrl}/${id}`, payload);
  }

  // show function
  showFun(id): Observable<any> {
    return this._httpClient.get(`${this.funUrl}/${id}`);
  }

  // delete a function
  deleteFun(id): Observable<any> {
    return this._httpClient.delete(`${this.funUrl}/${id}`);
  }

  // get all functions
  getAll(): Observable<any> {
    return this._httpClient.get(`${this.funUrl}/all`);
  }

  // // get all attributes that belong to a category
  // getItsAttributes(id): Observable<any> {
  //   return this._httpClient.get(`${this.categoryUrl}/${id}/attribute`);
  // }

  // check if category name has been taken or not
  checkFunCode(funCode): Observable<any> {
    return this._httpClient.get(`${this.funUrl}/check/${funCode}`);
  }
}