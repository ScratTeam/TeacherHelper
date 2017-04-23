import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartModule } from 'angular2-highcharts';
import 'hammerjs';

// 引入前端路由文件
import { RoutingModule } from './app-routing.module';

// 引入 components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';
import { AddcourseComponent } from './components/addcourse/addcourse.component';
import { TestComponent } from './components/test/test.component';

// 引入 services
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { CourseService } from './services/course/course.service';
import { TestService } from './services/test/test.service';

declare var require: any

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CourseComponent,
    AddcourseComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    // 动态响应模块
    FlexLayoutModule,
    // Material Design 模块
    MaterialModule,
    // 路由模块
    RoutingModule,
    // 图表文件
    ChartModule.forRoot(require('highcharts'))
  ],
  providers: [
    AuthService,
    UserService,
    CourseService,
    TestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
