import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 引入 components
import { LoginComponent } from './components/login/login.component';

const appRouters: Routes = [
  {
    path: '',
    redirectTo: 'login/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'login/:page',
    component: LoginComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRouters) ],
  exports: [ RouterModule ]
})
export class RoutingModule {}
