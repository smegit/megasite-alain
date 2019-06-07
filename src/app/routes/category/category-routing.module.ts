import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './list/list.component';
import { CategoryAttributeComponent } from './attribute/attribute.component';

const routes: Routes = [

  { path: '', component: CategoryListComponent },
  { path: 'attribute', component: CategoryAttributeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
