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

@NgModule({
  declarations: [CategoryComponent, ToolComponent, ClientComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgbModule,
    NgbNavModule,
    NavDynamicComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NavDynamicComponent],
})
export class PagesModule {}
