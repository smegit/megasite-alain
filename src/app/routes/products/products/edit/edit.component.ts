import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NzModalRef, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { _HttpClient, JSONP } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { CategoryService } from 'app/services/category/category.service';
import { ProductService } from 'app/services/product/product.service';
import { Observable, forkJoin, Observer } from 'rxjs';
import { ApprovalService } from 'app/services/approval/approval.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  transferListSource: any[] = [];
  //listOfCategory: Array<{ label: string; value: string }> = [];
  listOfCategory: any[] = [];
  fileList: UploadFile[] = [];
  approvalList: any[] = [];
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
    private approvalSrv: ApprovalService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.productForm = this.fb.group({
      model_number: [null, [Validators.required]],
      description: [null],
      type: [null],
      // data: this.fb.group(this.createData()),
    });

    this.nestedForm = this.fb.group({});

    // fork join two observables
    let allApprovals = this.approvalSrv.getAll();
    let allCategories = this.cateSrv.getAll();

    forkJoin([allApprovals, allCategories]).subscribe(results => {
      this.transferListSource = results[0].map(obj => {
        return {
          id: obj.id,
          title: obj.approval_no,
          direction: 'left'
        }
      });
      this.listOfCategory = results[1].map(res => {
        return {
          value: res.id,
          label: res.name,
        }
      });

      if (this.record.id > 0)
        this.prodSrv.getProduct(`${this.record.id}`).subscribe(res => {
          console.info(res);
          this.i = res;
          // this.categoryId = res.type;
          this.approvalList = res.approval.map(obj => obj.id);
          this.productForm.patchValue(res);
          this.transferListSource = this.transferListSource.map(obj => {
            return {
              id: obj.id,
              title: obj.title,
              direction: this.approvalList.includes(obj.id) ? 'right' : 'left',
            }
          })
          this.fileList = res.attachment;
          //this.productForm.setValue(res);
          // this.nestedForm.patchValue(res.data);
          console.info(this.productForm);
        });


    })

    // // get all approvals
    // this.approvalSrv.getAll().subscribe(
    //   res => {
    //     console.info(res);
    //     this.transferListSource = res.map(obj => {
    //       return {
    //         id: obj.id,
    //         title: obj.approval_no,
    //         direction: 'left'
    //       }
    //     })
    //   }
    // );

    // // load category info
    // this.cateSrv.getAll().subscribe(
    //   res => {
    //     this.listOfCategory = res.map(res => {
    //       return {
    //         value: res.id.toString(),
    //         label: res.name,
    //       }
    //     });
    //     console.info(this.listOfCategory);
    //     if (this.record.id > 0)
    //       this.prodSrv.getProduct(`${this.record.id}`).subscribe(res => {
    //         console.info(res);
    //         this.i = res;
    //         // this.categoryId = res.type;
    //         this.productForm.patchValue(res);
    //         this.fileList = res.attachment;
    //         //this.productForm.setValue(res);
    //         // this.nestedForm.patchValue(res.data);
    //         console.info(this.productForm);
    //       });
    //   }
    // );
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
              controlLabel: attr.label,
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
          console.info(this.i);
          // if select an existing product then load nested form detail
          if (this.i.hasOwnProperty('data')) {
            this.nestedForm.patchValue(this.i.data);
          }
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

      // append approval list
      formData.append('approval_list', JSON.stringify(this.approvalList));
      console.info(this.approvalList);

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

  change(evt: {}): void {
    console.log('nzChange', evt);
    if (Array.isArray(evt['list'])) {
      if (evt['from'] === 'left' && evt['to'] === 'right') {
        evt['list'].forEach(e => {
          this.approvalList.push(e.id);
        });
      } else if (evt['from'] === 'right' && evt['to'] === 'left') {
        evt['list'].forEach(e => {
          this.approvalList = this.approvalList.filter(attr => attr !== e.id);
        });
      }
    }
  }

  deleteRow(data) {
    console.info('deleteRow called');
    console.info(data);
    if (data.hasOwnProperty('id')) {
      if (parseInt(data.id) > 0) {
        this.prodSrv.deleteItsAttachment(this.record.id, data.id).subscribe(res => {
          this.fileList = this.fileList.filter(d => d.uid !== data.uid);
        });
      }
    } else {
      this.fileList = this.fileList.filter(d => d.uid !== data.uid);
    }
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }


  prodModelAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.prodSrv.checkModel(control.value).subscribe(res => {
        console.info(res);
        if (res.success) {
          observer.next(null);
        } else {
          observer.next({ error: true, duplicated: true });
        }
        observer.complete();
      });
    })
}
