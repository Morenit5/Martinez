import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/services/shell.service';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { CategoryComponent } from './inventory/category/category.component';
import { ToolComponent } from './inventory/tool/tool.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
    },
    {
      path: 'category',
      component:CategoryComponent
    },
    {
      path: 'tool',
      component:ToolComponent
    },

    // Fallback when no prior route is matched
    { path: '**', redirectTo: '', pathMatch: 'full' },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
