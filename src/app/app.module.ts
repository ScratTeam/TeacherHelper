import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

// 引入前端路由文件
import { RoutingModule } from './app-routing.module';

// 引入 components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { TestComponent } from './components/test/test.component';
import { ShareTestComponent } from './components/course/course.component';
import { AddStudentComponent } from './components/course/course.component';
import { AddTestComponent } from './components/add-test/add-test.component';
import { CheckInComponent } from './components/check-in/check-in.component';

// 引入 services
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { CourseService } from './services/course/course.service';
import { TestService } from './services/test/test.service';
import { CheckInService } from './services/check-in/check-in.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CourseComponent,
    AddCourseComponent,
    TestComponent,
    AddTestComponent,
    ShareTestComponent,
    AddStudentComponent,
    CheckInComponent
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
    MdNativeDateModule,
    // 路由模块
    RoutingModule
  ],
  entryComponents: [
    ShareTestComponent,
    AddStudentComponent
  ],
  providers: [
    AuthService,
    UserService,
    CourseService,
    TestService,
    CheckInService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
