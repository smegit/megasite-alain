import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { FunctionRoutingModule } from './function-routing.module';
import { FunctionListComponent } from './list/list.component';
import { FunctionListEditComponent } from './list/edit/edit.component';

const COMPONENTS = [
  FunctionListComponent];
const COMPONENTS_NOROUNT = [
  FunctionListEditComponent];

@NgModule({
  imports: [
    SharedModule,
    FunctionRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class FunctionModule { }
