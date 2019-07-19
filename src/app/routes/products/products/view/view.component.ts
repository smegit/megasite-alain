import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ProductService } from 'app/services/product/product.service';
import { CategoryService } from 'app/services/category/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-products-products-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ProductsProductsViewComponent implements OnInit {
  record: any = {};
  i: any;
  data: any = {};
  customAttributes: any[] = [];
  attachmentTypes: [];
  coverImageUrls: any[] = [];
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private prodSrv: ProductService,
    private cateSrv: CategoryService
  ) { }

  ngOnInit(): void {
    // this.http.get(`/user/1`).subscribe(res => this.i = res);
    let prodData = this.prodSrv.getProduct(this.record.id);
    let customAttr = this.cateSrv.getItsAttributes(this.record.type);
    // this.prodSrv.getProduct(this.record.id).subscribe(res => this.data = res);

    forkJoin([prodData, customAttr]).subscribe(results => {
      this.data = results[0];
      this.customAttributes = results[1];

      this.attachmentTypes =
        this.data['attachment'].map(e => e.type).filter((value, index, self) => { return self.indexOf(value) === index });
      if (Array.isArray(this.data['attachment'])) {
        this.data['attachment'].forEach(e => {
          if (e.type == 'CoverImage') {
            this.coverImageUrls.push(e.url);
          }
        });
      }
      console.info(this.attachmentTypes);
    });

  }

  close() {
    this.modal.destroy();
  }
  openEditModal() {
    console.info('openEdit called');
    this.modal.destroy({ msg: 'openEditModal' });

  }
  onClickImg(evt) {
    console.info('onClickImg called');
    console.info(evt);
    window.open(evt);
  }
}
