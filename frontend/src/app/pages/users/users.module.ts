import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { NavDynamicComponent } from "@app/shared/components";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { UsersInstances } from '@app/@core/services/Users.service';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, UsersRoutingModule, NavDynamicComponent,ReactiveFormsModule, FormsModule],
  providers:[UsersInstances]
})
export class UsersModule {}
