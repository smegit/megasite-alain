import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category/category.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-category-list-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      ::ng-deep .cdk-drag-preview {
        display: table;
      }

      ::ng-deep .cdk-drag-placeholder {
        opacity: 0;
      }
    `
  ]
})
export class CategoryListEditComponent implements OnInit {
  record: any = {};
  i: any;
  fileList: UploadFile[] = [];
  uploadTable: any = [];
  uploading = false;
  categoryForm: FormGroup;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private fb: FormBuilder,
    private cateSrv: CategoryService
  ) { }

  ngOnInit(): void {
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));

    // Build Category Form
    this.categoryForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
      parent_id: [null],
      image: [null]
    });
    console.info(this.record);
    //this.approvalForm.patchValue(this.record);
    // if (this.record.id > 0) {
    //   this.categoryForm.patchValue(this.record);
    // }
    // get category
    this.cateSrv.showCategory(this.record.id).subscribe(
      res => {
        this.fileList = res.attachment;
        this.categoryForm.patchValue(res);
      }
    );
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    this.uploadTable = this.uploadTable.concat(file);
    console.info(this.fileList);
    return false;
    //return true;
  }

  remove = (file): boolean => {
    console.info(file);
    return false;
  }

  uploadData = (file) => {
    console.info('nzData called');
  }

  save(value: any) {
    this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  submitForm() {
    console.info('submitForm called');
    const formData = new FormData();
    const fileAttributes = new Array();
    const cateFormValue = this.categoryForm.value;
    const activeFileList = this.fileList.filter(file => !(file.id > 0));
    console.info(this.fileList);
    console.info(this.uploadTable);

    if (this.categoryForm.valid) {

      // append files
      activeFileList.forEach((file: any) => {
        console.info(file);
        formData.append('files[]', file);
        fileAttributes.push({ description: file.description });
      });

      console.info(fileAttributes);
      formData.append('fileAttributes', JSON.stringify(fileAttributes));

      for (let key in cateFormValue) {
        formData.append(key, cateFormValue[key] != null ? cateFormValue[key] : '');
      }
      if (this.record.id > 0) {
        this.cateSrv.updateCategory(this.record.id, formData).subscribe(
          res => console.info(res),
        )
      } else {
        this.cateSrv.createCategory(formData).subscribe(
          res => console.info(res),
        );
      }

    }

  }
  close() {
    this.modal.destroy();
  }
  deleteRow(data): void {
    console.info(data);
    if (data.hasOwnProperty('id')) {
      if (parseInt(data.id) > 0) {
        this.cateSrv.deleteItsAttachment(this.record.id, data.id).subscribe(
          res => this.fileList = this.fileList.filter(d => d.uid !== data.uid),
        );
      }
    } else {
      this.fileList = this.fileList.filter(d => d.uid !== data.uid);
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.uploadTable, event.previousIndex, event.currentIndex);
  }
}
