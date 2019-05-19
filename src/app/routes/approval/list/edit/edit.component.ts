import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-approval-list-edit',
  templateUrl: './edit.component.html',
})
export class ApprovalListEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      // no: { type: 'string', title: '编号' },
      // owner: { type: 'string', title: '姓名', maxLength: 15 },
      // callNo: { type: 'number', title: '调用次数' },
      // href: { type: 'string', title: '链接', format: 'uri' },
      // description: { type: 'string', title: '描述', maxLength: 140 },
      approval_no: { type: 'string', title: 'Approval No.' },
      type: { type: 'string', title: 'Type' },
      sub_type: { type: 'string', title: 'Sub Type' },
      standard: { type: 'string', title: 'Standard' },
      reference: { type: 'string', title: 'Reference' },
      status: { type: 'string', title: 'Status' },
      effective_date: { type: 'string', title: 'Effective Date' },
      expiry_date: { type: 'string', title: 'Expiry Date' },
      description: { type: 'string', title: 'Description' },
      notes: { type: 'string', title: 'Notes' },
      doc: {
        type: 'string', title: 'Documents',
        enum: [
          {
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            response: {
              resource_id: 1,
            },
          },
        ],
        ui: {
          widget: 'upload',
          text: 'Upload',
          action: '/upload',
          resReName: 'resource_id',
          urlReName: 'url',
        },
      },
      test: { type: 'string', title: 'Notes' },
      tags: {
        type: 'string',
        title: 'Association',
        enum: [
          { label: '11', value: 'WAIT_BUYER_PAY' },
          { label: '22', value: 'TRADE_SUCCESS' },
          { label: '33', value: 'TRADE_FINISHED' },
        ],
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
        enum: [{ value: 1, label: 'Movie' }, { value: 2, label: 'Book' }, { value: 3, label: 'Travel' }],
        ui: {
          widget: 'tag',
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
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    this.i = this.record;
    // if (this.record.id > 0)
    //   this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));

  }

  save(value: any) {
    this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
      console.info(value);
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
