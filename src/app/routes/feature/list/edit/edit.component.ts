import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { CategoryService } from 'app/services/category/category.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { FeatureService } from 'app/services/feature/feature.service';

@Component({
  selector: 'app-feature-list-edit',
  templateUrl: './edit.component.html',
})
export class FeatureListEditComponent implements OnInit {
  record: any = {};
  i: any;
  category: any[] = [];
  featureTypeOptions: any[] = [];
  featureForm: FormGroup;
  // schema: SFSchema = {
  //   properties: {
  //     no: { type: 'string', title: '编号' },
  //     owner: { type: 'string', title: '姓名', maxLength: 15 },
  //     callNo: { type: 'number', title: '调用次数' },
  //     href: { type: 'string', title: '链接', format: 'uri' },
  //     description: { type: 'string', title: '描述', maxLength: 140 },
  //   },
  //   required: ['owner', 'callNo', 'href', 'description'],
  // };
  // ui: SFUISchema = {
  //   '*': {
  //     spanLabelFixed: 100,
  //     grid: { span: 12 },
  //   },
  //   $no: {
  //     widget: 'text'
  //   },
  //   $href: {
  //     widget: 'string',
  //   },
  //   $description: {
  //     widget: 'textarea',
  //     grid: { span: 24 },
  //   },
  // };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private cateSrv: CategoryService,
    private fb: FormBuilder,
    private featureSrv: FeatureService
  ) { }

  ngOnInit(): void {
    // build form 
    this.featureForm = this.fb.group({
      name: [null, [Validators.required]],
      short_description: [null],
      long_description: [null],
      feature_type: [null]
    })
    // load feature type list

    this.featureTypeOptions = this.category.map(category => {
      return {
        value: category.id,
        label: category.name
      }
    });


    console.info(this.category);

    if (this.record.id > 0) {
      //this.featureForm.patchValue(this.record);
      this.featureSrv.showFeature(this.record.id).subscribe(res => {
        console.info(res);
        this.featureForm.patchValue(res);
      });
    } else {
      // set feature name validator
      this.featureForm.get('name').setAsyncValidators([this.featureNameAsyncValidator]);
    }
  }

  save(value: any) {
    this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  featureNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors> | null) => {
      this.featureSrv.checkName(control.value).subscribe(res => {
        console.info(res);
        if (res.success) {
          observer.next(null)
        } else {
          observer.next({ error: true, duplicated: true });
        }
        observer.complete();
      });
    })

  submitForm() {
    const featureFormValue = this.featureForm.value;
    if (this.featureForm.valid) {
      if (this.record.id > 0) {
        this.featureSrv.updateFeature(this.record.id, featureFormValue).subscribe(res => {
          console.info(res);
          this.modal.close({ success: true });
        });
      } else {
        this.featureSrv.createFeature(featureFormValue).subscribe(res => {
          console.info(res);
          this.modal.close({ success: true });
        })
      }
    }

  }

  close() {
    this.modal.destroy();
  }
}
