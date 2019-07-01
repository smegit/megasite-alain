import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ProductsRoutingModule } from './products-routing.module';

import { ProductsComponent } from './products/products.component';
import { ProductsProductsEditComponent } from './products/edit/edit.component';
import { ProductsProductsViewComponent } from './products/view/view.component';

const COMPONENTS = [ProductsComponent];
const COMPONENTS_NOROUNT = [
  ProductsProductsEditComponent,
  ProductsProductsViewComponent];

@NgModule({
  imports: [
    SharedModule,
    ProductsRoutingModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ProductsModule { }
