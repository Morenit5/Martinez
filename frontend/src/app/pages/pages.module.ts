import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { CategoryComponent } from './inventory/category/category.component';
import { ToolComponent } from './inventory/tool/tool.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NavDynamicComponent } from '@app/shared/components';
import { ClientComponent } from './client/client.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentComponent } from './payment/payment.component';
import { ServiceComponent } from './services/service/service.component';
import { InvoceComponent } from './services/invoce/invoce.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [CategoryComponent, ToolComponent, ClientComponent, PaymentComponent, ServiceComponent, InvoceComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgbModule,
    NgbNavModule,
    NavDynamicComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [NavDynamicComponent],
})
export class PagesModule {}
