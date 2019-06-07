import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { CategoryAttributeEditComponent } from './edit/edit.component';
import { AttributeService } from '../../../services/attribute/attribute.service';

@Component({
  selector: 'app-category-attribute',
  templateUrl: './attribute.component.html',
})
export class CategoryAttributeComponent implements OnInit {
  loading = true;
  total: Number = 0;
  data: any[] = [];
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: 'Name'
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
    { title: 'Name', index: 'name' },
    { title: 'Description', index: 'description' },
    { title: 'UI Type', index: 'ui_type' },
    { title: 'Input Type', index: 'input_type' },
    {
      title: '',
      buttons: [
        // { text: 'View', click: (record: any) => { this.openView(record) } },
        { text: 'Edit', click: (record: any) => { this.openEdit(record) } },
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private attributeSrc: AttributeService) { }

  ngOnInit() {
    this.getData();
  }


  getData(limit?: string, offset?: string) {
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.loading = true;
    this.attributeSrc.getAttributes(l, o).subscribe(res => {
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

  add() {
    this.modal
      .createStatic(CategoryAttributeEditComponent, { i: { id: 0 } }, { size: 'md' })
      .subscribe(() => this.st.reload());
  }

  openView(record) {
    // this.modal.createStatic(CategoryAttributeEditComponent, { record }, { size: 'md' }).subscribe(
    //   () => this.st.reload()
    // );

  }

  openEdit(record) {
    this.modal.createStatic(CategoryAttributeEditComponent, { record }, { size: 'md' })
      .subscribe(() => this.st.reload());
  }

}
