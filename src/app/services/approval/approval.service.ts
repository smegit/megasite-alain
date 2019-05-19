import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { _HttpClient } from '@delon/theme';


const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class ApprovalService {
  approvalUrl: String = `${baseUrl}/approval`;
  constructor(
    private _httpClient: _HttpClient
  ) { }

  // get approvals
  getApproval(limit: string, offset: string): Observable<any> {
    console.info('getApproval called');
    const options = {
      limit: limit,
      offset: offset
    }
    return this._httpClient.get(`${this.approvalUrl}`, options);
  }
}