import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ProductsRoutingModule } from './products-routing.module';

import { ProductsComponent } from './products/products.component';

const COMPONENTS = [ProductsComponent];
const COMPONENTS_NOROUNT = [];

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
