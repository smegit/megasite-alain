import { environment } from "../../../environments/environment";
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable, Observer } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  categoryUrl: String = `${baseUrl}/category`;
  constructor(
    private _httpClient: _HttpClient,
  ) { }

  // get categories
  getCategories(limit: string, offset: string): Observable<any> {
    const options = {
      limit: limit,
      offset: offset
    };
    return this._httpClient.get(`${this.categoryUrl}`, options);
  }

  // create new category
  createCategory(payload): Observable<any> {
    return this._httpClient.post(`${this.categoryUrl}`, payload);
  }

  // update existing category
  updateCategory(id, payload): Observable<any> {
    return this._httpClient.put(`${this.categoryUrl}/${id}`, payload);
  }

  // show a category
  showCategory(id): Observable<any> {
    return this._httpClient.get(`${this.categoryUrl}/${id}`);
  }

  // delete a attachment
  deleteItsAttachment(id, attachment_id): Observable<any> {
    return this._httpClient.delete(`${this.categoryUrl}/${id}/attachment/${attachment_id}`);
  }

  // get all categories
  getAll(): Observable<any> {
    return this._httpClient.get(`${this.categoryUrl}/all`);
  }

  // get all attributes that belong to a category
  getItsAttributes(id): Observable<any> {
    return this._httpClient.get(`${this.categoryUrl}/${id}/attribute`);
  }

  // check if category name has been taken or not
  checkName(name): Observable<any> {
    return this._httpClient.get(`${this.categoryUrl}/check/${name}`);
  }
}