import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FunctionListComponent } from './list/list.component';

const routes: Routes = [

  { path: 'list', component: FunctionListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionRoutingModule { }
