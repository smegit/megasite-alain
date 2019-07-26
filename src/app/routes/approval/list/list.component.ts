import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { ApprovalService } from '../../../services/approval/approval.service';

import { ApprovalListViewComponent } from './view/view.component';
import { ApprovalListEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-approval-list',
  templateUrl: './list.component.html',
})
export class ApprovalListComponent implements OnInit {
  loading = true;
  total: Number = 0;
  data: any[] = [];
  searchSchema: SFSchema = {
    properties: {
      approval_no: {
        type: 'string',
        title: ''
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  page: STPage = {
    front: false,
    //total: '123',
    show: true,
    showSize: true,

  };
  columns: STColumn[] = [
    { title: 'Approval NO.', index: 'approval_no', sort: true },
    { title: 'Type', index: 'approval_type' },
    { title: 'Effective Date', index: 'effective_date' },
    { title: 'Expiry Date', index: 'expiry_date' },
    { title: 'Status', index: 'status' },
    {
      title: 'Action',
      buttons: [
        // { text: 'View', click: (item: any) => `/form/${item.id}` },
        { text: 'View', click: (item: any) => { this.openView(item) } },
        //{ text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
        { text: 'Edit', type: 'static', click: (item: any) => { this.openEdit(item) } },
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private approvalSrv: ApprovalService
  ) { }

  ngOnInit() {
    console.info('ngOnInit called');
    this.getData();
  }

  add() {
    console.info('add called');
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
    this.modal.createStatic(ApprovalListEditComponent, { i: { id: 0 } }).subscribe((res) => {
      console.info('add window close');
      console.info(res);
      this.st.reload();
    }
    );
  }

  getData(limit?: string, offset?: string) {
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.loading = true;
    const query = this.sf.value == undefined ? JSON.stringify({}) : JSON.stringify(this.sf.value);
    console.info(query);
    this.approvalSrv.getApprovals(l, o, query).subscribe(res => {
      this.data = res.rows;
      this.total = res.count;
      this.loading = false;
      console.info(res);
    },
      err => console.error('error', err));
  }

  // listener for table event
  stChange(e: STChange) {
    console.info('stChange called');
    console.info(e);
    const limit = e.ps.toString();
    const offset = ((e.pi - 1) * e.ps).toString();
    switch (e.type) {
      case 'pi':
        this.getData(limit, offset);
        break;
      case 'ps':
        this.getData(limit, offset);
        break;
    }
  }

  // open view modal
  openView(record: any = {}) {
    console.info('openView called');
    console.info(record);
    this.modal.create(ApprovalListViewComponent, { record }, { size: 'lg' }).subscribe(
      res => {
        console.info(res);
      }
    );
  }

  // open edit modal
  openEdit(record: any = {}) {
    console.info('openEdit called');
    console.info(record);
    this.modal.create(ApprovalListEditComponent, { record }, {
      size: 'lg', modalOptions: {
        nzMaskClosable: false
      }
    })
      .subscribe(res => {
        console.info('editwindow closed');
        console.info(res);
        this.st.reload();
      });
  }

}
