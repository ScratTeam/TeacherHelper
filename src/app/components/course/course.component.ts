import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../../services/auth/auth.service';
import { CourseService } from '../../services/course/course.service';
import { Course } from '../../services/course/course';
import { Validator } from '../../services/course/validator';
import { Test } from '../../services/test/test';
import { TestService } from '../../services/test/test.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.sass']
})
export class CourseComponent implements OnInit {
  course: Course;
  tests: Test[];
  errorMessage: string;
  validator = new Validator();

  constructor(private authService: AuthService, private router: Router,
              private snackBar: MdSnackBar, private testService: TestService,
              private courseService: CourseService, private activatedRoute: ActivatedRoute) {
    // 判断是否登录
    authService.verify().subscribe((data) => {
      if (!data.isOK) router.navigate(['/login', 'sign-in']);
    });
  }

  ngOnInit() {
    // 从 URL 中读取参数
    this.activatedRoute.params.subscribe((params: Params) => {
      // 取回课程信息
      this.courseService.getCourse(params['course']).subscribe((data) => {
        if (!data.isOK) this.router.navigate(['/login', 'sign-in']);
        else this.course = data;
      });
      this.tests = this.testService.getTests();
    });
  }

  updateCourse(courseInfo) {
    let oldName = this.course.name;
    let tempCourse = new Course(courseInfo.name, courseInfo.classroom, courseInfo.time);
    // 提交修改
    let errorMessage = this.validator.checkCourseInfo(courseInfo.name,courseInfo.classroom,
                                                      courseInfo.time);
    if (errorMessage != '') {
      this.errorMessage = errorMessage;
      return;
    }

    // 从后端更新课程信息
    this.courseService.updateCourse(tempCourse, oldName).subscribe((data) => {
      if (data.message) {
        if (data.message == '401') this.router.navigate(['/login', 'sign-in']);
        this.errorMessage = data.message;
      } else {
        this.course = data;
        this.errorMessage = '';
        this.snackBar.open('修改成功', '知道了', { duration: 2000 });
      }
    });
  }

  gotoTest(test) {
    this.authService.verify().subscribe((data) => {
      if (!data.isOK) {
        this.router.navigate(['/login', 'sign-in']);
      } else {
        this.router.navigate(['/test', data.username, this.course.name, test.name]);
      }
    });
  }

}
