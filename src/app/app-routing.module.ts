import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 引入 components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { TestComponent } from './components/test/test.component';
import { AddTestComponent } from './components/add-test/add-test.component';

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
    path: 'add-course/:username',
    component: AddCourseComponent
  },
  {
    path: 'test/:username/:course/:test',
    component: TestComponent
  },
  {
    path: 'add-test/:username/:course',
    component: AddTestComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRouters) ],
  exports: [ RouterModule ]
})
export class RoutingModule {}
