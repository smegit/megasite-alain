import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, UploadFile, TransferItem } from 'ng-zorro-antd';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFSchemaEnumType } from '@delon/form';
import { ApprovalService } from '../../../../services/approval/approval.service';
import { environment } from '../../../../../environments/environment';
import { of, Observable, Observer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { ProductService } from 'app/services/product/product.service';
import { CategoryService } from 'app/services/category/category.service';

@Component({
  selector: 'app-approval-list-edit',
  templateUrl: './edit.component.html',
})
export class ApprovalListEditComponent implements OnInit {
  record: any = {};
  i: any;
  fileList: UploadFile[] = [];
  loading = true;
  uploading = false;
  approvalForm: FormGroup;
  transferListSource: any[] = [];
  prodList: any[] = [];
  allTypeOpts: any[] = [];
  selected_types: any[] = [];

  // {
  //   name: "demo中文.pdf",
  //   size: 46673,
  //   type: "application/pdf",
  //   uid: "pbqvl03qu8q",
  //   webkitRelativePath: ""
  // },
  // {
  //   name: "demo中文.pdf",
  //   size: 46673,
  //   type: "application/pdf",
  //   uid: "pbqvl03qu9q",
  //   webkitRelativePath: ""
  // },

  // Get async filelist
  getFileList = (): Observable<SFSchemaEnumType[]> => {
    if (this.record.id > 0) {
      return this.approvalSrv.showItsAttachments(this.record.id);
    }
  }
  // Remove its attachment
  removeItsAttachment = (file): Observable<boolean> => {
    console.info(file);
    return new Observable<boolean>(observer => {
      if (this.record.id > 0 && file.id > 0) {

      }

      this.approvalSrv.deleteItsAttachment(this.record.id, file.id).subscribe(res => {
        if (res == null) {
          this.fileList.filter(e => e.uid != file.uid);
          return observer.next(true);
        }
        else {
          return observer.next(false);
        }
      })
    });
  }

  approvalUploadPath = environment.uploadUrl + '/approval';
  schema: SFSchema = {
    properties: {
      // no: { type: 'string', title: '编号' },
      // owner: { type: 'string', title: '姓名', maxLength: 15 },
      // callNo: { type: 'number', title: '调用次数' },
      // href: { type: 'string', title: '链接', format: 'uri' },
      // description: { type: 'string', title: '描述', maxLength: 140 },
      approval_no: { type: 'string', title: 'Approval No.' },
      approval_type: { type: 'string', title: 'Type' },
      sub_type: { type: 'string', title: 'Sub Type' },
      standard: { type: 'string', title: 'Standard' },
      reference: { type: 'string', title: 'Reference' },
      status: { type: 'string', title: 'Status' },
      effective_date: { type: 'string', title: 'Effective Date' },
      expiry_date: { type: 'string', title: 'Expiry Date' },
      description: { type: 'string', title: 'Description' },
      notes: { type: 'string', title: 'Notes' },
      attachment: {
        type: 'string', title: 'Documents',
        // enum: [
        //   {
        //     uid: -1,
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //     response: {
        //       resource_id: 1,
        //       msg: 'upload success'
        //     },
        //   },
        //   {
        //     uid: -2,
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //     response: {
        //       resource_id: 2,
        //       msg: 'upload success'
        //     },
        //   },
        // ],
        // ui: {
        //   widget: 'upload',
        //   text: 'Upload',
        //   action: this.approvalUploadPath,
        //   beforeUpload: this.beforeUpload,
        //   //fileList: this.fileList,
        //   resReName: 'resource_id',
        //   urlReName: 'url'
        // },
      },
      test: { type: 'string', title: 'Notes' },
      tags: {
        type: 'string',
        title: 'Association',
        // enum: [
        //   { label: '11', value: 'WAIT_BUYER_PAY' },
        //   { label: '22', value: 'TRADE_SUCCESS' },
        //   { label: '33', value: 'TRADE_FINISHED' },
        // ],
        ui: {
          widget: 'select',
          mode: 'tags',
          maxTagCount: '100',
          grid: { span: 24 }
        },
        default: null,
      },
      like: {
        type: 'number',
        title: 'hobby',
        //enum: [{ value: 1, label: 'Movie' }, { value: 2, label: 'Book' }, { value: 3, label: 'Travel' }],
        ui: {
          widget: 'tag',
          asyncData: () =>
            of([
              { value: 1, label: '电影' },
              { value: 2, label: '书' },
              { value: 3, label: '旅行' },
            ]).pipe(delay(10)),
        },
        default: [1, 2],
      },

    },

    //required: ['owner', 'callNo', 'href', 'description'],
    required: ['approval_no'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $no: {
      widget: 'text'
    },
    $href: {
      widget: 'string',
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
    },
    $notes: {
      widget: 'textarea',
      grid: { span: 24 }
    },
    $effective_date: {
      widget: 'date',
      grid: { span: 12 }
    },
    $expiry_date: {
      widget: 'date',
      grid: { span: 12 }
    },
    $attachment: {
      widget: 'upload',
      text: 'Upload',
      action: this.approvalUploadPath,
      beforeUpload: (file: UploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        // this.fileList = [
        // {
        //   name: "demo中文.pdf",
        //   size: 46673,
        //   type: "application/pdf",
        //   uid: "pbqvl03qu9q",
        //   webkitRelativePath: ""
        // },];
        console.info(this.fileList);
        return false;
      },
      fileList: this.fileList,
      asyncData: this.getFileList,
      //name: 'docs',
      data: (file) => { return { uid: file.uid } },
      // asyncData: () =>
      //   of([
      //     {
      //       name: "demo中文.pdf",
      //       size: 46673,
      //       type: "application/pdf",
      //       uid: "pbqvl03qu8q",
      //       status: "done",
      //       //url: "app/public/upload/approvals/Statement_13317334.pdf",
      //       webkitRelativePath: ""
      //     },
      //     {
      //       name: "demo中文.pdf",
      //       size: 46673,
      //       type: "application/pdf",
      //       uid: "pbqvl03qu9q",
      //       status: "done",
      //       webkitRelativePath: ""
      //     },
      //   ]).pipe(delay(10)),
      ///resReName: 'msg',
      urlReName: 'url',
      multiple: true,
      remove: this.removeItsAttachment,
      // remove: (file) => {
      //   return new Observable<boolean>(observer => {
      //     this.approvalSrv.deleteItsAttachment(this.record.id, file.id).subscribe(res => {
      //       if (res == null)
      //         return observer.next(true);
      //       else
      //         return observer.next(false);
      //     })
      //   });
      //   //this.approvalSrv.deleteItsAttachment(this.record.id, file.id);
      // },
      change: function (args: UploadChangeParam) {
        console.info('file changed');
        console.info(args);
        //args.fileList = [];
      },
      // preview: function (file: UploadFile) {
      //   console.info('preview called');
      //   console.info(file);
      // },
      // customRequest: function (item) {
      //   console.info('customRequest called');
      //   console.info(item);
      //   return false;
      // }
    },
  };



  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private approvalSrv: ApprovalService,
    private fb: FormBuilder,
    private prodSrv: ProductService,
    private cateSrv: CategoryService,
  ) { }

  ngOnInit(): void {
    // this.i = this.record;
    // if (this.record.id > 0)
    //   this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
    // Get details of approval 
    this.approvalForm = this.fb.group({
      approval_no: [null, [Validators.required]],
      approval_type: [null,],
      sub_type: [null],
      standard: [null],
      reference: [null],
      status: [null, [Validators.required]],
      effective_date: [null, [Validators.required]],
      expiry_date: [null, [Validators.required]],
      description: [null],
      notes: [null],
      product_types: [null],
    });

    this.cateSrv.getAll().subscribe(res => {
      console.info(res);
      this.allTypeOpts = res.map(obj => {
        return {
          value: obj.id,
          label: obj.name
        }
      });
    });

    this.prodSrv.getAll().subscribe(
      res => {
        console.info(res);
        this.transferListSource = res.map(obj => {
          return {
            id: obj.id,
            title: obj.model_number,
            type: obj.type,
            direction: 'left',
          };
        });

        if (this.record.id > 0) {
          // disable approval_no field
          this.approvalForm.get('approval_no').disable({ onlySelf: true });
          this.approvalSrv.showApproval(this.record.id).subscribe(
            res => {
              //this.i = res;
              this.prodList = res.product.map(obj => obj.id);
              this.fileList = res.attachment;
              this.approvalForm.patchValue(res);
              console.info()

              this.transferListSource = this.transferListSource.map(obj => {
                const selectTypesArray = this.approvalForm.get('product_types').value || [];
                let hide;
                if (selectTypesArray.length > 0) {
                  if (selectTypesArray.includes(obj.type)) {
                    hide = false;
                  } else {
                    hide = true;
                  }
                } else {
                  hide = false;
                }

                return {
                  id: obj.id,
                  title: obj.title,
                  type: obj.type,
                  direction: this.prodList.includes(obj.id) ? 'right' : 'left',
                  _hiden: hide,
                }
              });
              this.loading = false;
            }
          )
        } else {
          this.loading = false;
          // set async validator for approval no
          this.approvalForm.get('approval_no').setAsyncValidators([this.approvalNoAsyncValidator]);
        }


      });


  }

  approvalNoAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.approvalSrv.checkDuplicates(control.value).subscribe(res => {
        console.info(res);
        if (res.success) {
          observer.next(null);
        } else {
          observer.next({ error: true, duplicated: true });
        }
        observer.complete();
      })
    });


  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    console.info(this.fileList);
    return false;
  };

  remove = (file): Observable<boolean> => {
    console.info(file);
    return new Observable<boolean>(observer => {

      // delete an existing attachment
      if (this.record.id > 0 && file.id > 0) {
        this.approvalSrv.deleteItsAttachment(this.record.id, file.id).subscribe(res => {
          if (res == null) {
            this.fileList = this.fileList.filter(e => e.uid != file.uid);
            return observer.next(true);
          }
          else
            return observer.next(false);
        })
      } else {
        this.fileList = this.fileList.filter(e => e.uid != file.uid);
        return observer.next(true);
      }


    });
  }

  filterOpts = (inputValue: string, item: TransferItem) => {
    console.info(inputValue);
    console.info(item);
  };

  submitForm() {
    console.info('submitForm called');
    console.info(this.approvalForm.value);
    const formData = new FormData();
    //const approvalFormValue = this.approvalForm.value;
    const approvalFormValue = this.approvalForm.getRawValue();
    const activeFileList = this.fileList.filter(file => !(file.id > 0));

    console.info(approvalFormValue);
    // validate the form 
    if (this.approvalForm.valid) {
      console.info(this.fileList);
      activeFileList.forEach((file: any) => {
        console.info(file);
        //if (file.id != 'removed') {
        formData.append('files[]', file);
        //}
      });
      for (let key in approvalFormValue) {
        if (key == 'product_types') {
          console.info(approvalFormValue[key]);
          formData.append(key, approvalFormValue[key] != null ? JSON.stringify(approvalFormValue[key]) : '');
        } else {
          formData.append(key, approvalFormValue[key] != null ? approvalFormValue[key] : '');
        }
      }
      this.uploading = true;
      for (const i in this.approvalForm.controls) {
        this.approvalForm.controls[i].markAsDirty();
        this.approvalForm.controls[i].updateValueAndValidity();
      }
      console.log(this.approvalForm.value);
      // append product list
      formData.append('prodList', JSON.stringify(this.prodList));
      if (this.record.id > 0) {
        this.approvalSrv.updateApproval(this.record.id, formData).subscribe(
          res => {
            console.info(res);
            this.modal.close({ success: true });
            this.msgSrv.create('success', `Your approval has been saved successfully.`);
          },
          err => {
            this.modal.destroy();
            this.msgSrv.create('error', `Failed to save your approval.`);
          }
        );
      } else {
        this.approvalSrv.createApproval(formData).subscribe(
          res => {
            console.info(res);
            this.modal.close({ success: true });
            this.msgSrv.create('success', `Your approval has been updated successfully.`);
          },
          err => {
            this.modal.destroy();
            this.msgSrv.create('error', `Failed to update your approval.`);
          }
        );
      }
    } else {
      for (const i in this.approvalForm.controls) {
        this.approvalForm.controls[i].markAsDirty();
        this.approvalForm.controls[i].updateValueAndValidity();
      }
    }


  }

  change(evt) {
    console.info('change called');
    console.info(evt);
    if (Array.isArray(evt['list'])) {
      if (evt['from'] === 'left' && evt['to'] === 'right') {
        evt['list'].forEach(e => {
          this.prodList.push(e.id);
        });
      } else if (evt['from'] === 'right' && evt['to'] === 'left') {
        evt['list'].forEach(e => {
          this.prodList = this.prodList.filter(attr => attr !== e.id);
        });
      }
    }
    console.info(this.prodList);
  }
  close() {
    this.modal.destroy();
  }

  // Selection change event
  onTypeChange(evt) {
    console.info('onTypeChange called');
    //console.info(evt);
    // console.info(this.approvalForm.get('product_type').value);
    const selectTypesArray = this.approvalForm.get('product_types').value;
    console.info(selectTypesArray);
    // this.transferListSource.forEach(obj => obj._hiden = false);
    this.transferListSource = this.transferListSource.map(obj => {
      //console.info(obj);
      //console.info(selectTypesArray.indexOf(obj.type));
      let hide;
      if (selectTypesArray.length > 0) {
        if (selectTypesArray.includes(obj.type)) {
          hide = false;
        } else {
          hide = true;
        }
      } else {
        hide = false;
      }
      return {
        direction: obj.direction,
        id: obj.id,
        title: obj.title,
        type: obj.type,
        _hiden: hide,
      }
    })
    // this.transferListSource.forEach(item => selectTypesArray.includes(item.type) ? item._hiden = false : item._hiden = true);
    console.info(this.transferListSource);


  }
}
