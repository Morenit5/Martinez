import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { CategoryComponent } from './inventory/category/category.component';
import { ToolComponent } from './inventory/tool/tool.component';

@NgModule({
  declarations: [
    CategoryComponent,
    ToolComponent
  ],
  imports: [CommonModule, PagesRoutingModule],
})
export class PagesModule {}
