import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/services/shell.service';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { CategoryComponent } from './inventory/category/category.component';
import { ToolComponent } from './inventory/tool/tool.component';
import { ClientComponent } from './client/client.component';
import { PaymentComponent } from './payment/payment.component';
import { ServiceComponent } from './services/service/service.component';
import { InvoceComponent } from './services/invoce/invoce.component';
import { ConfigsComponent } from './configs/configs.component';
//import { AuthenticationGuard } from '@app/auth/guard/authentication.guard';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'users',
      loadChildren: () =>
        import('./users/users.module').then((m) => m.UsersModule),
    },
    {
      path: 'service',
      component: ServiceComponent,
    },
    {
      path: 'invoice',
      component: InvoceComponent,
    },
    {
      path: 'category',
      component: CategoryComponent,
    },
    {
      path: 'tool',
      component: ToolComponent,
    },
    {
      path: 'client',
      component: ClientComponent,
      //canActivate: [AuthenticationGuard],
    },
    {
      path: 'payment',
      component: PaymentComponent,
    },  
    {
      path: 'configs',
      component: ConfigsComponent,
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
