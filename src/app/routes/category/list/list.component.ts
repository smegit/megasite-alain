import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { CategoryListEditComponent } from './edit/edit.component';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './list.component.html',
})
export class CategoryListComponent implements OnInit {
  loading = true;
  total: Number = 0;
  data: any[] = [];

  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: 'Id'
      }
    }
  };
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: 'Name', index: 'name' },
    { title: 'Description', index: 'description' },
    { title: 'Parent', index: 'parent_id' },
    {
      title: '',
      buttons: [
        { text: 'View', click: (record: any) => { this.openView(record) } },
        { text: 'Edit', click: (record: any) => { this.openEdit(record) } },
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private cateSrv: CategoryService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(limit?: string, offset?: string) {
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.cateSrv.getCategories(l, o).subscribe(
      res => {
        this.data = res.rows;
        this.total = res.count;
        this.loading = false;
        console.info(res);
      },
      err => console.error('error', err),
    );
  }
  add() {
    console.info('add called');
    this.modal
      .createStatic(CategoryListEditComponent, { i: { id: 0 } }, { size: 'md' })
      .subscribe(() => this.st.reload());
  }
  openView(item) {

  }
  openEdit(record) {
    console.info('openEdit called');
    console.info(record);
    this.modal.createStatic(CategoryListEditComponent, { record }, { size: 'md' })
      .subscribe(() => this.st.reload());
  }

}
