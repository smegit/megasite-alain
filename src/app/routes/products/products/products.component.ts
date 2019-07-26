import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { STComponent, STColumn, STChange, STPage } from '@delon/abc';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ProductService } from '../../../services/product/product.service';
import { ProductsProductsEditComponent } from './edit/edit.component';
import { CategoryService } from 'app/services/category/category.service';
import { ProductsProductsViewComponent } from './view/view.component';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})

export class ProductsComponent implements OnInit {

  confirmToDelModal: NzModalRef;
  listOfCategory: any[] = [];
  q: any = {

  };
  data: any[] = [];
  loading = true;
  total: Number = 0;
  size = 5;
  category = [
    { index: 0, text: 'Cate1', value: false, type: 'default', checked: false },
    {
      index: 1,
      text: 'Cate2',
      value: false,
      type: 'processing',
      checked: false,
    },
    { index: 2, text: 'Cate3', value: false, type: 'success', checked: false },
    { index: 3, text: 'Cate4', value: false, type: 'error', checked: false },
  ];

  aesthetic = [
    { index: 0, text: 'Classic', value: 'classic' },
    { index: 0, text: 'Dolce Stil Novo', value: 'dsn' },
    { index: 0, text: 'Linear', value: 'linear' },
    { index: 0, text: 'Victoria', value: 'victoria' }
  ];

  @ViewChild('st')
  st: STComponent;
  page: STPage = {
    front: false,
    //total: '123',
    show: true,
    showSize: true,

  };
  columns: STColumn[] = [
    { title: 'ID', index: 'id', },
    { title: 'Model Number', index: 'model_number' },
    { title: 'Description', index: 'description' },
    { title: 'Category', index: 'category.name' },
    {
      title: 'Action',
      buttons: [
        {
          text: 'View',
          click: (record: any) => this.openView(record),
        },
        {
          text: 'Edit',
          click: (record: any) => this.openEdit(record),
        },
        // {
        //   text: 'Delete'
        // },
        {
          text: 'More',
          children: [{
            text: 'Copy',
            icon: '',
            click: (record: any) => this.openCopy(record),
          }, {
            text: 'Delete',
            //icon: 'delete',
            // click: (record: any) => {
            //   console.info('Delete clicked');
            //   console.info(record);
            // }
            click: (record: any) => this.showConfirmModal(record),
          }]
        }
      ]
    }
  ];
  expandForm = true;


  constructor(
    private httpClient: HttpClient,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
    private msgSrv: NzMessageService,
    private prodSrv: ProductService,
    private cateSrc: CategoryService,

  ) { }


  ngOnInit() {
    console.info('ngOnInit called');
    this.getData();

    // get all categories
    this.cateSrc.getAll().subscribe(res => {
      this.listOfCategory = res.map(e => {
        return {
          value: e.id,
          label: e.name
        }
      })
    });
  }

  getData(limit?: string, offset?: string) {
    // this.httpClient.get('http://localhost:7001/product').subscribe((res: any) => {
    //   console.info(res);
    //   //this.total = res.count;
    //   this.data = res.rows;
    //   this.total = res.count;
    // });
    const l = limit ? limit : '10';
    const o = offset ? offset : '0';
    this.loading = true;
    const query = JSON.stringify(this.q);
    this.prodSrv.getProds(l, o, query).subscribe(res => {
      this.data = res.rows;
      this.total = res.count;
      this.loading = false;
    },
      err => console.error('error', err));
  }

  reset() {
    console.info('reset called');
    this.q = {};
    this.getData();
  }

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

  // add new product
  add() {
    console.info('add called');
    this.modal.createStatic(ProductsProductsEditComponent, { i: { id: 0 } }, { size: 'md' })
      .subscribe(res => {
        console.info(res);
        this.st.reload();
      })
  }
  openEdit(record) {
    console.info('openEdit called');
    console.info(record);
    this.modal.createStatic(ProductsProductsEditComponent, { record, copy: false }, { size: 'md' }).subscribe(
      res => {
        console.info(res);
        this.st.reload();
      }
    )
  }
  // Open view modal
  openView(record) {
    console.info('openView called');
    console.info(record);
    this.modal.createStatic(ProductsProductsViewComponent, { record }, { size: 'md' }).subscribe(
      res => {
        console.info(res);
        if (res.msg == 'openEditModal') {
          this.openEdit(record);
        }
      }
    )
  }

  // Open copy modal
  openCopy(record) {
    console.info('openCopy called');
    this.modal.createStatic(ProductsProductsEditComponent, { record, copy: true }, { size: 'md' }).subscribe(
      res => {
        console.info(res);
        this.st.reload();
      }
    );
  }

  showConfirmModal(record) {
    console.info('showConfirmModal called');
    console.info(record);
    this.modalSrv.confirm({
      nzTitle: `Do you want to delete ${record.model_number}?`,
      nzContent: 'When clicked the OK button, the item will be deleted permanently.',
      nzOnOk: () => {
        console.info('confirm clicked');
        this.prodSrv.deleteProd(record.id).subscribe(res => {
          console.info(res);
          if (res === null) {
            this.msgSrv.create('success', `Product ${record.model_number} has been deleted successfully.`);
            this.st.reload();
          }
        })
      }
    })
  }
}