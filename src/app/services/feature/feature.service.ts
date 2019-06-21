import { environment } from "../../../environments/environment";
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable, Observer } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class FeatureService {
  featureUrl: String = `${baseUrl}/feature`;
  constructor(
    private _httpClient: _HttpClient,
  ) { }

  // get features
  getFeatures(limit: string, offset: string, query: any): Observable<any> {
    const options = {
      limit: limit,
      offset: offset,
      query: query
    };
    return this._httpClient.get(`${this.featureUrl}`, options);
  }

  // create new feature
  createFeature(payload): Observable<any> {
    return this._httpClient.post(`${this.featureUrl}`, payload);
  }

  // update existing feature
  updateFeature(id, payload): Observable<any> {
    return this._httpClient.put(`${this.featureUrl}/${id}`, payload);
  }

  // show a feature
  showFeature(id): Observable<any> {
    return this._httpClient.get(`${this.featureUrl}/${id}`);
  }


  // get all features
  // getAll(): Observable<any> {
  //   return this._httpClient.get(`${this.featureUrl}/all`);
  // }


  // check if category name has been taken or not
  checkName(name): Observable<any> {
    return this._httpClient.get(`${this.featureUrl}/check/${name}`);
  }
  // get all features that belongs to its type 
  getFeaturesByType(type): Observable<any> {
    return this._httpClient.get(`${this.featureUrl}/type/${type}`);
  }
}