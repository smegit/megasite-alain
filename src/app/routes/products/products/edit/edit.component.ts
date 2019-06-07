import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NzModalRef, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { _HttpClient, JSONP } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CategoryService } from 'app/services/category/category.service';
import { ProductService } from 'app/services/product/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products-products-edit',
  templateUrl: './edit.component.html',
})
export class ProductsProductsEditComponent implements OnInit {
  record: any = {};
  i: any;
  // categoryId: any = '';
  selectedValue = 14;
  productForm: FormGroup;
  nestedForm: FormGroup;
  baseForm: FormGroup;
  controlArray: Array<{ uiType: string; controlInstance: string }> = [];
  //listOfCategory: Array<{ label: string; value: string }> = [];
  listOfCategory: any[] = [];
  fileList: UploadFile[] = [];
  fileTypeOptions: Array<{ label: string; value: string }> = [
    { label: 'Image', value: 'Image' },
    { label: 'Schematic', value: 'Schematic' },
  ];


  @ViewChild("model") modelField: ElementRef;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private fb: FormBuilder,
    private cateSrv: CategoryService,
    private prodSrv: ProductService,
  ) { }

  ngOnInit(): void {

    this.productForm = this.fb.group({
      model_number: [null, [Validators.required]],
      description: [null],
      type: [null],
      // data: this.fb.group(this.createData()),
    });

    this.nestedForm = this.fb.group({});


    // load category info
    this.cateSrv.getAll().subscribe(
      res => {
        this.listOfCategory = res.map(res => {
          return {
            value: res.id.toString(),
            label: res.name,
          }
        });
        console.info(this.listOfCategory);
        if (this.record.id > 0)
          this.prodSrv.getProduct(`${this.record.id}`).subscribe(res => {
            console.info(res);
            this.i = res;
            // this.categoryId = res.type;
            this.productForm.patchValue(res);
            //this.productForm.setValue(res);
            this.nestedForm.patchValue(res.data);
            console.info(this.productForm);
          });
      }
    );
    // const children: Array<{ label: string; value: string }> = [];
    // for (let i = 10; i < 36; i++) {
    //   children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    // }
    // this.listOfCategory = children;




  }



  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    // this.uploadTable = this.uploadTable.concat(file);
    console.info(this.fileList);
    return false;
  }
  save(value: any) {
    this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }

  // build dynamic form 
  createData(): FormGroup {
    return this.fb.group({
      Noise: [null],
      Cleaning: [null],
      Capacity: [null],
    });
  }

  // buildNestedForm(): Observable<any> {

  // }

  // Category selection changed
  selectCategoryChange(evt: any) {
    console.info('selectCategoryChange called');
    console.info(evt);
    // clear control array
    this.controlArray = [];

    //  clear the nested form
    this.nestedForm = this.fb.group({});
    console.info(this.nestedForm);
    this.cateSrv.getItsAttributes(evt).subscribe(
      res => {
        console.info(res);
        if (Array.isArray(res)) {
          const control = res.map(attr => {
            return {
              uiType: attr.ui_type,
              controlInstance: attr.name,
              options: attr.options,
            }
          });
          for (let i = 0; i < control.length; i++) {
            this.nestedForm.addControl(
              control[i].controlInstance,
              new FormControl(null)
            );
          }
          this.productForm.addControl('data', this.nestedForm);
          this.controlArray = control;
          console.info(this.controlArray);
          // this.productForm.patchValue(this.i);
          this.nestedForm.patchValue(this.i.data);

        }
      }
    );
  }

  submitForm() {
    console.info('submitForm called');
    const formData = new FormData();
    const fileAttributes = new Array();
    const prodFormValue = this.productForm.value;
    const activeFileList = this.fileList.filter(file => !(file.id > 0));

    console.info(prodFormValue);
    if (this.productForm.valid) {
      // append files
      activeFileList.forEach((file: any) => {
        console.info(file);
        formData.append('files[]', file);
        fileAttributes.push({ description: file.description, type: file.fileType });
      });

      formData.append('fileAttributes', JSON.stringify(fileAttributes));

      // append form value
      console.info(prodFormValue);
      for (let key in prodFormValue) {
        if (prodFormValue[key] != null) {
          if (key === 'data') {
            formData.append(key, JSON.stringify(prodFormValue[key]));
          } else {
            formData.append(key, prodFormValue[key]);
          }
        } else {
          formData.append(key, '');
        }
      }

      if (this.record.id > 0) {
        this.prodSrv.updateProduct(this.record.id, formData).subscribe(
          res => {
            console.info(res);
            this.modal.close({ success: true });
            this.msgSrv.create('success', `Product ${res.name} has been updated successfully.`)
          }
        )
      } else {
        this.prodSrv.createProduct(formData).subscribe(
          res => {
            console.info(res);
            this.modal.close({ success: true });
            this.msgSrv.create('success', `Product ${res.name} has been created successfully.`);
          }
        );
      }

    }

  }
}
