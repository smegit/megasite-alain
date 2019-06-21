import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { FeatureRoutingModule } from './feature-routing.module';
import { FeatureListComponent } from './list/list.component';
import { FeatureListEditComponent } from './list/edit/edit.component';
import { FeatureListViewComponent } from './list/view/view.component';

const COMPONENTS = [
  FeatureListComponent];
const COMPONENTS_NOROUNT = [
  FeatureListEditComponent,
  FeatureListViewComponent];

@NgModule({
  imports: [
    SharedModule,
    FeatureRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class FeatureModule { }
