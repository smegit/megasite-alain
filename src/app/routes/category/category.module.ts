import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './list/list.component';
import { CategoryListEditComponent } from './list/edit/edit.component';

const COMPONENTS = [
  CategoryListComponent];
const COMPONENTS_NOROUNT = [
  CategoryListEditComponent];

@NgModule({
  imports: [
    SharedModule,
    CategoryRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class CategoryModule { }
