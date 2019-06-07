import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './list/list.component';
import { CategoryListEditComponent } from './list/edit/edit.component';
import { CategoryAttributeComponent } from './attribute/attribute.component';
import { CategoryAttributeEditComponent } from './attribute/edit/edit.component';

const COMPONENTS = [
  CategoryListComponent,
  CategoryAttributeComponent];
const COMPONENTS_NOROUNT = [
  CategoryListEditComponent,
  CategoryAttributeEditComponent];

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
