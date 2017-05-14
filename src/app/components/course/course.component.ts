import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';

import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';
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
  course;
  tests: Test[];
  errorMessage: string;
  validator = new Validator();
  user: User;

  // 表格管理
  displayStudents = [];  // 当前显示的学生名单
  currentStudentsPage: number = 1;
  studentsPages = [];
  displayTests = [];  // 当前显示的测试
  currentTestsPage: number = 1;
  testsPages = [];

  constructor(private userService: UserService, private router: Router,
              private snackBar: MdSnackBar, private testService: TestService,
              private courseService: CourseService, private activatedRoute: ActivatedRoute,
              public dialog: MdDialog) {
    // 如果用户未登录，则跳转到注册登录页面
    userService.getUser().subscribe((data) => {
      if (data.isOK)
        this.user = new User(data.username, data.avatar,
                             data.university, data.school);
      else
        router.navigate(['/login', 'sign-in']);
    });
  }

  ngOnInit() {
    // 从 URL 中读取参数
    this.activatedRoute.params.subscribe((params: Params) => {
      // 取回课程信息
      this.courseService.getCourse(params['course']).subscribe((data) => {
        if (!data.isOK) this.router.navigate(['/login', 'sign-in']);
        else this.course = data;
        // 设置当前显示的学生名单
        this.displayStudents = data.students.slice(0, 8);
        let totalPages = Math.ceil(data.students.length / 8);
        for (let i = 1; i <= totalPages; i++) this.studentsPages.push(i);
      });

      this.tests = this.testService.getTests(params['course']);
      // 设置当前显示的测试列表
      this.displayTests = this.tests.slice(0, 8);
      let totalPages = Math.ceil(this.tests.length / 8);
      for (let i = 1; i <= totalPages; i++) this.testsPages.push(i);
    });
  }

  // 更新课程
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

  // 前往试题页面
  gotoTest(test) {
    this.router.navigate(['/test', this.user.username, this.course.name, test.name]);
  }

  // 为学生列表翻页
  gotoStudentPage(pageNumber: number) {
    this.currentStudentsPage = pageNumber;
    let min;
    if (pageNumber != this.studentsPages.length) min = 8;
    else min = this.course.students.length - 8 * (this.studentsPages.length - 1);
    this.displayStudents = this.course.students.slice(8 * (pageNumber - 1),
                                                      8 * pageNumber);
  }

  // 为试题列表翻页
  gotoTestPage(pageNumber: number) {
    this.currentTestsPage = pageNumber;
    let min;
    if (pageNumber != this.testsPages.length) min = 8;
    else min = this.tests.length - 8 * (this.testsPages.length - 1);
    this.displayTests = this.tests.slice(8 * (pageNumber - 1), 8 * pageNumber);
  }

  // 创建新的试题
  creatTest() {
    this.router.navigate(['/add-test', this.user.username, this.course.name]);
  }

  // 转换日期格式
  toDateString(date: Date) {
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' +
           date.getDate();
  }

  // 判断当前的测试的状态
  checkState(myindex) {
    if (this.tests[myindex].startTime > new Date()) {
      return "未开始";
    } else if (this.tests[myindex].endTime > new Date()) {
      return "正在进行中";
    } else {
      return "已结束";
    }
  }

  // 生成二维码
  shareTest(testName) {
    let config = new MdDialogConfig();
    let dialogRef: MdDialogRef<ShareTestComponent> = this.dialog.open(ShareTestComponent, config);
    dialogRef.componentInstance.testUrl = this.router.url + testName;
  }

}

@Component({
  selector: 'shareTest',
  templateUrl: './share-test.component.html',
  styleUrls: ['./share-test.component.sass']
})
export class ShareTestComponent implements OnInit {
  testUrl: string;
  shareUrl: string;
  constructor(public dialogRef: MdDialogRef<ShareTestComponent>) {}

  ngOnInit() {
    this.shareUrl = "http://qr.liantu.com/api.php?text=" + this.testUrl;
  }


}
