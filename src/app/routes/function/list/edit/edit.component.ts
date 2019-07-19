import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { FunService } from 'app/services/fun/fun.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { CategoryService } from 'app/services/category/category.service';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-function-list-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],

})
export class FunctionListEditComponent implements OnInit {
  record: any = {};
  i: any;
  funForm: FormGroup;
  fileList: UploadFile[] = [];
  listOfProductType: any[] = [];
  schema: SFSchema = {
    properties: {
      no: { type: 'string', title: '编号' },
      owner: { type: 'string', title: '姓名', maxLength: 15 },
      callNo: { type: 'number', title: '调用次数' },
      href: { type: 'string', title: '链接', format: 'uri' },
      description: { type: 'string', title: '描述', maxLength: 140 },
    },
    required: ['owner', 'callNo', 'href', 'description'],
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
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private funSrv: FunService,
    private fb: FormBuilder,
    private cateSrv: CategoryService
  ) { }

  ngOnInit(): void {
    this.funForm = this.fb.group({
      product_type: [null],
      function_code: [null, [Validators.required, this.funCodeValidator]],
      description: [null, [Validators.required]],
      url: [{ value: '', disabled: true }]
    });

    // Get all categories / product type 
    this.cateSrv.getAll().subscribe(res => {
      this.listOfProductType = res.map(cate => {
        return {
          value: cate.id,
          label: cate.name,
        }
      });
    });

    // auto-complete 'description' field
    this.funForm.get('function_code').valueChanges.subscribe(
      (name: string) => {
        console.info('function_code changed');
        const splitStr = name.toLowerCase().split('_');
        for (let i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        const label = splitStr.join(' ');
        this.funForm.get('description').setValue(label);
      }
    );
    if (this.record.id > 0) {
      this.funSrv.showFun(this.record.id).subscribe(res => {
        this.funForm.patchValue(res);
        if (res.url != null) {
          // this.fileList.push({
          //   name: 'xx.jpg',
          //   status: 'done',
          //   uid: 'brp517ij99r',
          //   size: 1234,
          //   type: 'image/jpeg',
          //   url: 'https://zgkdzjjeshoppub.oss-ap-southeast-2.aliyuncs.com/automatic_cleaning.jpg',
          //   thumbUrl: 'https://zgkdzjjeshoppub.oss-ap-southeast-2.aliyuncs.com/automatic_cleaning.jpg'
          // });
        }
        console.info(this.fileList);
      });
    } else {
      this.funForm.get('function_code').setAsyncValidators([this.funCodeAsyncValidator]);

    }
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  // Validators
  funCodeValidator = (control: FormControl): { [s: string]: boolean } => {

    if (!control.value) {
      return { required: true };
    } else if (!/^[a-z]+(?:_+[a-z]+)*$/.test(control.value)) {
      return { name: true, error: true, wrongFormat: true };
    }
    return {};
  }

  funCodeAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.funSrv.checkFunCode(control.value).subscribe(res => {
        console.info(res);
        if (res.success) {
          observer.next(null);
        } else {
          observer.next({ error: true, duplicated: true });
        }
        observer.complete();
      });
    })

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    console.info(this.fileList);
    this.funForm.get('url').setValue(null);
    return false;
    //return true;
  }
  save(value: any) {
    this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  submitForm() {
    const formData = new FormData();
    const funFormValue = this.funForm.value;
    // console.info(this.fileList);
    const activeFileList = this.fileList.filter(file => (file.uid.length > 0));

    console.info(this.funForm)
    console.info(this.funForm.valid);
    if (this.funForm.valid) {
      // append file 
      activeFileList.forEach((file: any) => {
        console.info(file);
        formData.append('files[]', file);
      });
      // append form value
      console.info(funFormValue);
      for (let key in funFormValue) {
        if (funFormValue[key] != null) {
          formData.append(key, funFormValue[key]);
        } else {
          formData.append(key, '');
        }
      }

      if (this.record.id > 0) {
        this.funSrv.updateFun(this.record.id, formData).subscribe(
          (res) => {
            console.info(res);
            this.modal.close({ success: true });
            this.msgSrv.create('success', `Function ${res.name} has been updated successfully.`)
          },
          (err) => {
            this.modal.destroy();
            this.msgSrv.create('error', `Failed to update attribute ${this.record.function_code}.`);
          }
        )
      } else {
        this.funSrv.createFun(formData).subscribe(
          (res) => {
            console.info(res);
            this.modal.close({ success: true });
            this.msgSrv.create('success', `Attribute ${res.function_code} has been created successfully`);
          },
          (err) => {
            console.info(err);
            this.modal.destroy();
            this.msgSrv.create('error', `Failed to create attribute ${funFormValue.function_code}`);
          }
        );
      }
    } else {
      for (const i in this.funForm.controls) {
        this.funForm.controls[i].markAsDirty();
        this.funForm.controls[i].updateValueAndValidity();
      }
    }
  }

  close() {
    this.modal.destroy();
  }
}
