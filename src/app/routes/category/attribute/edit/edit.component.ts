import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { AttributeService } from '../../../../services/attribute/attribute.service';
import { Observable, observable, Observer } from 'rxjs';

@Component({
  selector: 'app-category-attribute-edit',
  templateUrl: './edit.component.html',
})
export class CategoryAttributeEditComponent implements OnInit {
  record: any = {};
  i: any;
  attributeForm: FormGroup;
  listOfUiType: Array<{ label: string; value: string }> = [
    { label: 'Input', value: 'Input' },
    { label: 'Single Selection', value: 'Single Selection' },
    { label: 'Multi Selection', value: 'Multi Selection' }
  ];
  listOfGroup: any[] = [];

  //   [
  //   { label: 'Most Important', value: 'most_important' },
  //   { label: 'Important', value: 'important' },
  //   { label: 'Not Important', value: 'not_important' }
  // ];
  groupTip = 'This is used to group attributes';
  sequenceTip = 'This sequence defines the order of attributes within the group';

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private fb: FormBuilder,
    private attributeSrv: AttributeService
  ) { }

  ngOnInit(): void {
    this.attributeForm = this.fb.group({
      name: [null, [this.nameValidator]],
      label: [null],
      description: [null],
      ui_type: [null, [Validators.required]],
      input_type: [null],
      options: [null],
      seq_group: [null, [this.seqGroupValidator]],
      sequence: [null]
    });


    // define 'options' validator on condition
    this.attributeForm.get('ui_type').valueChanges.subscribe(
      (uiType: string) => {
        this.attributeForm.get('options').clearValidators();
        if (uiType === 'Single Selection' || uiType === 'Multi Selection') {
          //this.attributeForm.get('options').setValidators([Validators.required]);
        }
        // this.attributeForm.get('options').updateValueAndValidity();
      }
    );

    // get distinct list seq group options

    this.attributeSrv.getAllAttributes().subscribe(res => {
      console.info(res);
      // this.listOfGroup = res.map();
      for (let i = 0; i < res.length; i++) {
        if (Array.isArray(res[i]['seq_group'])) {
          if (!this.listOfGroup.includes(res[i]['seq_group'][0])) {
            this.listOfGroup.push(res[i]['seq_group'][0]);
          }
        }

      }
    });


    // // get all attributes
    // this.attributeSrv.getAllAttributes().subscribe(
    //   (res) => {

    //   }
    // );

    // get details
    if (this.record.id > 0) {
      // disable 'name' input
      this.attributeForm.get('name').disable();
      this.attributeSrv.showAttribute(this.record.id).subscribe(
        (res) => {
          this.attributeForm.patchValue(res);
        }
      );
    } else {
      this.attributeForm.get('name').setAsyncValidators([this.attrNameAsyncValidator]);
      // auto-complete 'label' field
      this.attributeForm.get('name').valueChanges.subscribe(
        (name: string) => {
          console.info('name changed');
          const splitStr = name.toLowerCase().split('_');
          for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
          }
          const label = splitStr.join(' ');
          this.attributeForm.get('label').setValue(label);
        }
      )
    }
  }

  // submit form
  submitForm() {
    const attributeFormValue = this.attributeForm.getRawValue();
    console.info(attributeFormValue);


    // Validate form value
    // for (const i in this.attributeForm.controls) {
    //   this.attributeForm.controls[i].markAsDirty();
    //   this.attributeForm.controls[i].updateValueAndValidity();
    // }
    console.info(this.attributeForm.valid);
    if (this.attributeForm.valid) {
      if (this.record.id > 0) { // update attribute
        this.attributeSrv.updateAttribute(this.record.id, attributeFormValue).subscribe(
          (res) => {
            console.info(res);
            this.modal.close({ success: true });
            this.msgSrv.create('success', `Attribute ${res.label} has been updated successfully`);
          },
          (err) => {
            this.modal.destroy();
            this.msgSrv.create('error', `Failed to update attribute ${this.record.label}.`);
          }
        );
      } else {
        this.attributeSrv.createAttribute(attributeFormValue).subscribe(
          (res) => {
            console.info(res);
            this.modal.close({ success: true });
            this.msgSrv.create('success', `Attribute ${res.label} has been created successfully`);
          },
          (err) => {
            console.info(err);
            this.modal.destroy();
            this.msgSrv.create('error', `Failed to create attribute ${attributeFormValue.label}`);
          }
        );

      }

    }

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

  // Validators
  nameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (!/^[a-z]+(?:_+[a-z]+)*$/.test(control.value)) {
      return { name: true, error: true, wrongFormat: true };
    }
    return {};
  }

  seqGroupValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!/^[a-z]+(?:_+[a-z]+)*$/.test(control.value) && control.value.length > 0) {
      console.info('true');
      return { name: true, error: true, wrongFormat: true };
    }
    return {};
  }

  attrNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.attributeSrv.checkName(control.value).subscribe(res => {
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
