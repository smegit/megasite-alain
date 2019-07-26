import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STChange, STPage } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { FunService } from '../../../services/fun/fun.service';
import { FunctionListEditComponent } from './edit/edit.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-function-list',
  templateUrl: './list.component.html',
})
export class FunctionListComponent implements OnInit {
  url = `/user`;
  loading = true;
  total: Number = 0;
  q: any = {};
  data: any[] = [];
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '',
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
    { title: 'Id', index: 'id' },
    { title: 'Product Type', index: 'product_type' },
    { title: 'Function Code', index: 'function_code' },
    { title: 'Description', index: 'description' },
    { title: 'Icon', type: 'img', width: '50px', index: 'url', click: (record) => console.info('icon clicked') },
    {
      title: '',
      buttons: [
        // { text: 'View', click: (item: any) => this.openView(item) },
        { text: 'Edit', click: (item: any) => this.openEdit(item) },
        { text: 'Delete', click: (item: any) => this.onDelete(item) },
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
    private funSrv: FunService,
    private msgSrv: NzMessageService,

  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(limit?: string, offset?: string) {
    console.info('getData called');
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    console.info(this.sf.value);
    const query = this.sf.value == undefined ? JSON.stringify({}) : JSON.stringify(this.sf.value);
    console.info(query);

    this.funSrv.getFuns(l, o, query).subscribe(
      res => {
        this.data = res.rows;
        this.total = res.count;
        this.loading = false;
        console.info(res);
      },
      err => console.error('error', err),
    );
  }
  search(formValue) {
    console.info('search called');
    console.info(formValue);
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
      case 'click':
        this.clickEventHandle(e);
    }
  }
  add() {
    this.modal
      .createStatic(FunctionListEditComponent, { i: { id: 0 } }, { size: 'md' })
      .subscribe(() => this.st.reload());
  }
  openEdit(record) {
    this.modal
      .createStatic(FunctionListEditComponent, { record }, { size: 'md' })
      .subscribe(() => this.st.reload());
  }
  openView(record) {

  }
  // Delete function
  onDelete(record) {
    console.info('showConfirmModal called');
    console.info(record);
    this.modalSrv.confirm({
      nzTitle: `Do you want to delete item - ${record.function_code}?`,
      nzContent: 'When clicked the OK button, the item will be deleted permanently.',
      nzOnOk: () => {
        console.info('confirm clicked');
        this.funSrv.deleteFun(record.id).subscribe(res => {
          console.info(res);
          if (res === null) {
            this.msgSrv.create('success', `Function ${record.function_code} has been deleted successfully.`);
            this.st.reload();
          }
        })
      }
    })

  }

  clickIcon(record, instance) {
    console.info('clickIcon called');
    console.info(record);
    console.info(instance);
  }
  clickEventHandle(event) {
    console.info('clickEventHandle called');
    console.info(event.click.e);
    // display icon in modal
    if (event.click.e.toElement == 'img.img') {
      console.info('should display icon modal')
    }
  }

}
