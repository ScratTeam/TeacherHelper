import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 引入 components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';
import { AddcourseComponent } from './components/addcourse/addcourse.component';
import { TestComponent } from './components/test/test.component';

const appRouters: Routes = [
  {
    path: '',
    redirectTo: 'login/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'login/:page',
    component: LoginComponent
  },
  {
    path: 'home/:username',
    component: HomeComponent
  },
  {
    path: 'course/:username/:course',
    component: CourseComponent
  },
  {
    path: 'addcourse/:username',
    component: AddcourseComponent
  },
  {
    path: 'test/:username/:course/:test',
    component: TestComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRouters) ],
  exports: [ RouterModule ]
})
export class RoutingModule {}
