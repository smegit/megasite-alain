import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { _HttpClient } from '@delon/theme';
import { deepGet } from '@delon/util';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class ApprovalService {
  approvalUrl: String = `${baseUrl}/approval`;
  constructor(
    private _httpClient: _HttpClient,
    private httpClient: HttpClient
  ) { }

  // get approvals
  getApprovals(limit: string, offset: string, query: any): Observable<any> {
    console.info('getApproval called');
    const options = {
      limit: limit,
      offset: offset,
      query: query
    }
    return this._httpClient.get(`${this.approvalUrl}`, options);
  }
  // create new approval
  createApproval(payload): Observable<any> {
    console.info('createApproval called');
    return this._httpClient.post(`${this.approvalUrl}`, payload);
  }

  // update existing approval
  updateApproval(id, payload): Observable<any> {
    console.info('updateApproval called');
    return this._httpClient.put(`${this.approvalUrl}/${id}`, payload);
  }

  // Show an Approval
  showApproval(id): Observable<any> {
    console.info('showApproval called');
    return this._httpClient.get(`${this.approvalUrl}/${id}`);
  }
  showItsAttachments(id): Observable<any> {
    return this._httpClient.get(`${this.approvalUrl}/${id}/attachment`);
  }
  deleteItsAttachment(id, attachment_id): Observable<any> {
    console.info('deleteItsAttachment called');
    // return new Observable<boolean>(observer => {
    //   this._httpClient.delete(`${this.approvalUrl}/${id}/attachment/${attachment_id}`).subscribe(res => {
    //     if (res == null) {
    //       observer.next(true);
    //     } else {
    //       observer.next(false);
    //     }
    //   })
    // });
    return this._httpClient.delete(`${this.approvalUrl}/${id}/attachment/${attachment_id}`);

  }

  // get all approvals (brife list)
  getAll(): Observable<any> {
    return this._httpClient.get(`${this.approvalUrl}/all`);
  }
  // check approval no duplicates
  checkDuplicates(approvalNo): Observable<any> {
    return this._httpClient.get(`${this.approvalUrl}/check/${approvalNo}`);
  }
}