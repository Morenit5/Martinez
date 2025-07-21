import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { CategoryComponent } from './inventory/category/category.component';
import { ToolComponent } from './inventory/tool/tool.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NavDynamicComponent } from '@app/shared/components';

@NgModule({
  declarations: [CategoryComponent, ToolComponent],
  imports: [CommonModule, PagesRoutingModule, NgbModule, NgbNavModule, NavDynamicComponent],
  exports: [NavDynamicComponent]
})
export class PagesModule {}
