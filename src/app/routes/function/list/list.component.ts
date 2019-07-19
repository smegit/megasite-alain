import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STChange, STPage } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { FunService } from '../../../services/fun/fun.service';
import { FunctionListEditComponent } from './edit/edit.component';

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
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st') st: STComponent;
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
        { text: 'View', click: (item: any) => this.openView(item) },
        { text: 'Edit', click: (item: any) => this.openEdit(item) },
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private funSrv: FunService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(limit?: string, offset?: string) {
    console.info('getData called');
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    const query = JSON.stringify(this.q);
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
