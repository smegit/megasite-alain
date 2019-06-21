import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { FeatureService } from 'app/services/feature/feature.service';
import { FeatureListEditComponent } from './edit/edit.component';
import { CategoryService } from 'app/services/category/category.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FeatureListViewComponent } from './view/view.component';

@Component({
  selector: 'app-feature-list',
  templateUrl: './list.component.html',
})
export class FeatureListComponent implements OnInit {
  // url = `/user`;
  q: any = {};
  loading = true;
  data: any[] = [];
  total: Number = 0;
  categoryList: any[] = [];
  searchForm: FormGroup;
  searchSchema: SFSchema = {
    properties: {
      name: {
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
    { title: 'Id', index: 'id' },
    { title: 'Name', index: 'name' },
    { title: 'Short Description', index: 'short_description' },
    { title: 'Feature Type', index: 'feature_type_name' },
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
    private featureSrv: FeatureService,
    private cateSrv: CategoryService,
    private fb: FormBuilder) { }

  ngOnInit() {
    // build search form
    this.searchForm = this.fb.group({
      name: [null]
    });
    // load category info
    this.cateSrv.getAll().subscribe(res => {
      this.categoryList = res;
      this.getData();
    });

  }

  getData(limit?: string, offset?: string) {
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.loading = true;
    const query = JSON.stringify(this.q);
    this.featureSrv.getFeatures(l, o, query).subscribe(res => {
      this.data = res.rows;
      this.data = this.data.map(d => {
        const theCategory = this.categoryList.filter(obj => obj.id === parseInt(d.feature_type));
        console.info(theCategory);
        return {
          id: d.id,
          name: d.name,
          short_description: d.short_description,
          long_description: d.long_description,
          feature_type_name: theCategory.length === 1 ? theCategory[0]['name'] : '',
        }
      })
      this.total = res.count;
      this.loading = false;
      console.info(res);
    },
      err => console.error(err))
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
      .createStatic(FeatureListEditComponent, { i: { id: 0 }, category: this.categoryList })
      .subscribe(() => this.st.reload());
  }

  openView(record) {
    // get the details of the feature
    console.info(record);
    console.info('openView called');
    this.modal.createStatic(FeatureListViewComponent, { record }).subscribe((res) => {
      console.info(res);
    })

  }

  openEdit(record) {
    // get the detail of the feature
    console.info(record);
    this.modal.createStatic(FeatureListEditComponent, { record, category: this.categoryList })
      .subscribe(() => this.st.reload());
  }
}
