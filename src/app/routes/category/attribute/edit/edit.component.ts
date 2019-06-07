import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AttributeService } from '../../../../services/attribute/attribute.service';

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

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private fb: FormBuilder,
    private attributeSrv: AttributeService
  ) { }

  ngOnInit(): void {
    this.attributeForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
      ui_type: [null],
      input_type: [null],
      options: [null]
    });

    // // get all attributes
    // this.attributeSrv.getAllAttributes().subscribe(
    //   (res) => {

    //   }
    // );

    // get details
    if (this.record.id > 0)
      this.attributeSrv.showAttribute(this.record.id).subscribe(
        (res) => {
          this.attributeForm.patchValue(res);
        }
      );
  }

  // submit form
  submitForm() {
    const attributeFormValue = this.attributeForm.value;
    console.info(attributeFormValue);

    if (this.record.id > 0) { // update attribute
      this.attributeSrv.updateAttribute(this.record.id, attributeFormValue).subscribe(
        (res) => {
          console.info(res);
          this.modal.close({ success: true });
          this.msgSrv.create('success', `Attribute ${res.name} has been updated successfully`);
        },
        (err) => {
          this.modal.destroy();
          this.msgSrv.create('error', `Failed to update attribute ${this.record.name}.`);
        }
      );
    } else {
      this.attributeSrv.createAttribute(attributeFormValue).subscribe(
        (res) => {
          console.info(res);
          this.modal.close({ success: true });
          this.msgSrv.create('success', `Attribute ${res.name} has been created successfully`);
        },
        (err) => {
          console.info(err);
          this.modal.destroy();
          this.msgSrv.create('error', `Failed to create attribute ${attributeFormValue.name}`);
        }
      );

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
}
