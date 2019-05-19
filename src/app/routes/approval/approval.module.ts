import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ApprovalRoutingModule } from './approval-routing.module';
import { ApprovalListComponent } from './list/list.component';
import { ApprovalListViewComponent } from './list/view/view.component';
import { ApprovalListEditComponent } from './list/edit/edit.component';

const COMPONENTS = [
  ApprovalListComponent];
const COMPONENTS_NOROUNT = [
  ApprovalListViewComponent,
  ApprovalListEditComponent];

@NgModule({
  imports: [
    SharedModule,
    ApprovalRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ApprovalModule { }
