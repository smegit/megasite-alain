import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './list/list.component';

const COMPONENTS = [
  CategoryListComponent];
const COMPONENTS_NOROUNT = [];

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
