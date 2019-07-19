import { environment } from "../../../environments/environment";
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class AttributeService {
  attributeUrl: String = `${baseUrl}/attribute`;
  constructor(
    private _httpClient: _HttpClient,
  ) { }

  // get attributes by limit and offset
  getAttributes(limit: string, offset: string, query: any): Observable<any> {
    const options = {
      limit: limit,
      offset: offset,
      query: query
    };
    return this._httpClient.get(`${this.attributeUrl}`, options);
  }

  getAllAttributes(): Observable<any> {
    return this._httpClient.get(`${this.attributeUrl}/all`);
  }

  // create new attribute
  createAttribute(payload): Observable<any> {
    return this._httpClient.post(`${this.attributeUrl}`, payload);
  }

  // update existing attribute
  updateAttribute(id, payload): Observable<any> {
    return this._httpClient.put(`${this.attributeUrl}/${id}`, payload);
  }

  // show a attribute
  showAttribute(id): Observable<any> {
    return this._httpClient.get(`${this.attributeUrl}/${id}`);
  }
  // async validate attribute name
  checkName(name): Observable<any> {
    return this._httpClient.get(`${this.attributeUrl}/check/${name}`);
  }

}