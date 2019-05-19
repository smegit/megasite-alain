import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class UserAccessService {
  loginUrl: string = `${baseUrl}/user/access/login?_allow_anonymous=true`;
  constructor(
    private _httpClient: _HttpClient,
    private httpClient: HttpClient
  ) { }

  // Login
  login(loginDetails): Observable<any> {
    //return this._httpClient.post(`${this.loginUrl}`);
    return this._httpClient.post(`${this.loginUrl}`, loginDetails);
  }


}