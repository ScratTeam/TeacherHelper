import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';
import { CourseService } from '../../services/course/course.service';
import { Course } from '../../services/course/course';
import { Validator } from '../../services/course/validator';
import { Test } from '../../services/test/test';
import { TestService } from '../../services/test/test.service';
import { CheckIn } from '../../services/check-in/check-in';
import { CheckInService } from '../../services/check-in/check-in.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.sass']
})
export class CourseComponent implements OnInit {
  course;
  tests: Test[];
  checkIns: CheckIn[];
  errorMessage: string;
  validator = new Validator();
  user: User;
  addStudentError: string;
  courseName: string;
  isLoaded: boolean = false;

  // 表格管理
  displayStudents = [];  // 当前显示的学生名单
  currentStudentsPage: number = 1;
  studentsPages = [];
  displayTests = [];  // 当前显示的测试
  displayCheckIns = [];
  currentTestsPage: number = 1;
  currentCheckInPage: number = 1;
  testsPages = [];
  checkInPages = [];

  constructor(public userService: UserService, public router: Router,
              public snackBar: MdSnackBar, public testService: TestService,
              public courseService: CourseService, public activatedRoute: ActivatedRoute,
              public dialog: MdDialog, public checkInService: CheckInService) {
    this.isLoaded = false;
    // 如果用户未登录，则跳转到注册登录页面
    userService.getUser().subscribe((data) => {
      this.isLoaded = true;
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
      this.courseName = params['course'];
      this.courseService.getCourse(this.courseName).subscribe((data) => {
        if (!data.isOK) this.router.navigate(['/login', 'sign-in']);
        else this.course = data;
        // 设置当前显示的学生名单
        this.displayStudents = data.students.slice(0, 8);
        let totalPages = Math.ceil(data.students.length / 8);
        for (let i = 1; i <= totalPages; i++) this.studentsPages.push(i);
      });

      // 取回测试信息
      this.testService.getTests(this.courseName).subscribe((data) => {
        this.tests = data;
        // 设置当前显示的测试列表
        this.displayTests = this.tests.slice(0, 8);
        let totalPages = Math.ceil(this.tests.length / 8);
        for (let i = 1; i <= totalPages; i++) this.testsPages.push(i);
      });

      // 取回签到信息
      this.checkInService.getCheckIns(this.courseName).subscribe((data) => {
        if (data.isOK) {
          this.checkIns = data.checkIns;
          // 设置当前显示的签到列表
          this.displayCheckIns = this.checkIns.slice(0, 8);
          let totalPages = Math.ceil(this.checkIns.length / 8);
          for (let i = 1; i <= totalPages; i++) this.checkInPages.push(i);
        }
      });
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
  toDateString(date_: Date) {
    let date = new Date(date_);
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' +
           date.getDate();
  }

  // 判断当前的测试的状态
  checkState(i: number) {
    if (new Date(this.tests[i].startTime) > new Date()) {
      return "未开始";
    } else if (new Date(this.tests[i].endTime) > new Date()) {
      return "正在进行中";
    } else if (new Date(this.tests[i].endTime) < new Date()) {
      return "已结束";
    }
  }

  // 生成二维码，分享课程
  shareTest(testName) {
    let config = new MdDialogConfig();
    let dialogRef: MdDialogRef<ShareTestComponent> = this.dialog.open(ShareTestComponent, config);
    dialogRef.componentInstance.testUrl = this.router.url.replace(/\/course\//, '/test/') + '/' + testName;
  }

  // 跳转到编辑试题页面
  editTest(testName) {
    this.router.navigate(['/edit-test', this.user.username, this.course.name, testName]);
  }

  // 删除试题
  deleteTest(testName) {
    this.testService.deleteTest(this.course.name, testName).subscribe((data) => {
      if (data.isOK) {
        // 删除前端数据
        for (let i = 0; i < this.tests.length; i++) {
          if (this.tests[i].name == testName)
            this.tests.splice(i, 1);
        }
        // 重新设置当前显示的测试列表
        this.displayTests = this.tests.slice(0, 8);
        let totalPages = Math.ceil(this.tests.length / 8);
        this.testsPages = [];
        for (let i = 1; i <= totalPages; i++) this.testsPages.push(i);
        // 显示提示信息
        this.snackBar.open('删除成功', '知道了', { duration: 2000 });
        this.currentTestsPage = 1;
      } else {
        this.snackBar.open('删除失败，请刷新重试', '知道了', { duration: 2000 });
      }
    });
  }

  // 创建新的签到事件
  creatCheckIn() {
    this.checkInService.createCheckIn(this.courseName).subscribe((data) => {
      if (data.isOK) {
        let checkIn = new CheckIn(this.courseName, true, [], data.id);
        this.checkIns.unshift(checkIn);
        this.displayCheckIns = this.checkIns.slice(0, 8);
        let totalPages = Math.ceil(this.checkIns.length / 8);
        this.checkInPages = [];
        for (let i = 1; i <= totalPages; i++) this.checkInPages.push(i);
      } else {
        this.snackBar.open('创建失败，请刷新重试', '知道了', { duration: 2000 });
      }
    });
  }

  // 开启或者关闭签到事件
  toggleCheckIn(checkIn) {
    this.checkInService.toggleCheckIn(this.courseName, checkIn.id).subscribe((data) => {
      if (data.isOK) {
        checkIn.state = !checkIn.state;
      } else {
        this.snackBar.open('状态转换失败，请刷新重试', '知道了', { duration: 2000 });
      }
    });
  }

  // 删除签到事件
  deleteCheckIn(checkIn) {
    this.checkInService.deleteCheckIn(this.courseName, checkIn.id).subscribe((data) => {
      if (data.isOK) {
        // 删除前端数据
        for (let i = 0; i < this.checkIns.length; i++) {
          if (this.checkIns[i] == checkIn)
            this.checkIns.splice(i, 1);
        }
        // 重新设置当前显示的测试列表
        this.displayCheckIns = this.checkIns.slice(0, 8);
        let totalPages = Math.ceil(this.checkIns.length / 8);
        this.checkInPages = [];
        for (let i = 1; i <= totalPages; i++) this.checkInPages.push(i);
        // 显示提示信息
        this.snackBar.open('删除成功', '知道了', { duration: 2000 });
        this.currentCheckInPage = 1;
      } else {
        this.snackBar.open('删除失败，请刷新重试', '知道了', { duration: 2000 });
      }
    });
  }

  // 跳转到签到页面
  gotoCheckIn(checkIn) {
    this.router.navigate(['/check-in', this.user.username, this.courseName, checkIn.id]);
  }

  // 分享签到页面的二维码
  shareCheckIn(checkIn) {
    let config = new MdDialogConfig();
    let dialogRef: MdDialogRef<ShareCheckInComponent> = this.dialog.open(ShareCheckInComponent, config);
    dialogRef.componentInstance.checkInUrl = this.router.url.replace(/\/course\//, '/check-in/') + '/' + checkIn.id;
  }

  // 为签到页面换页
  gotoCheckInPage(pageNumber: number) {
    this.currentCheckInPage = pageNumber;
    let min;
    if (pageNumber != this.checkInPages.length) min = 8;
    else min = this.checkIns.length - 8 * (this.checkInPages.length - 1);
    this.displayCheckIns = this.checkIns.slice(8 * (pageNumber - 1), 8 * pageNumber);
  }

  // 删除学生
  deleteStudent(studentId) {
    this.courseService.deleteStudent(this.course.name, studentId).subscribe((data) => {
      if (data.isOK) {
        for (let i = 0; i < this.displayStudents.length; i++) {
          if (this.displayStudents[i].id == studentId)
            this.displayStudents.splice(i, 1);
        }
        // 重新设置当前显示的测试列表
        this.displayStudents = data.students.slice(0, 8);
        let totalPages = Math.ceil(data.students.length / 8);
        this.studentsPages = [];
        for (let i = 1; i <= totalPages; i++) this.studentsPages.push(i);
        // 显示提示信息
        this.snackBar.open('删除成功', '知道了', { duration: 2000 });
        this.currentStudentsPage = 1;
      } else {
        this.snackBar.open('删除失败，请刷新重试', '知道了', { duration: 2000 });
      }
    });
  }

  // 添加学生
  addStudent() {
    let dialogRef = this.dialog.open(AddStudentComponent);
    dialogRef.afterClosed().subscribe(result => {
      let studentId = result.id;
      let studentName = result.name;
      if (studentId == null || studentId == undefined || studentId == '' ||
          studentName == null || studentName == undefined || studentName == '') {
        this.snackBar.open('学生信息不能为空', '知道了', { duration: 2000 });
      } else {
        this.courseService.addStudent(this.course.name, studentId, studentName).subscribe((data) => {
          if (data.isOK) {
            // 重新设置当前显示的测试列表
            this.displayStudents = data.students.slice(0, 8);
            let totalPages = Math.ceil(data.students.length / 8);
            this.studentsPages = [];
            for (let i = 1; i <= totalPages; i++) this.studentsPages.push(i);
            // 显示提示信息
            this.snackBar.open('添加成功', '知道了', { duration: 2000 });
          } else {
            if (data.message == '401')
              this.snackBar.open('添加失败，请刷新重试', '知道了', { duration: 2000 });
            else
              this.addStudentError = data.message;
          }
        });
      }
    });
  }

}

@Component({
  selector: 'shareTest',
  templateUrl: 'share-test/share-test.component.html',
  styleUrls: ['share-test/share-test.component.sass']
})
export class ShareTestComponent implements OnInit {
  testUrl: string;
  shareUrl: string;
  constructor(public dialogRef: MdDialogRef<ShareTestComponent>) {}

  ngOnInit() {
    this.shareUrl = "http://qr.liantu.com/api.php?text=https://scrat.pw" + this.testUrl;
  }

}

@Component({
  selector: 'shareCheckIn',
  templateUrl: 'share-check-in/share-check-in.component.html',
  styleUrls: ['share-check-in/share-check-in.component.sass']
})
export class ShareCheckInComponent implements OnInit {
  checkInUrl: string;
  shareUrl: string;
  constructor(public dialogRef: MdDialogRef<ShareTestComponent>) {}

  ngOnInit() {
    this.shareUrl = "http://qr.liantu.com/api.php?text=https://scrat.pw" + this.checkInUrl;
  }

}

@Component({
  selector: 'addStudent',
  templateUrl: 'add-student/add-student.component.html',
  styleUrls: ['add-student/add-student.component.sass']
})
export class AddStudentComponent implements OnInit {
  constructor(public dialogRef: MdDialogRef<ShareTestComponent>) {}

  ngOnInit() {}

  submit(formData) {
    let student = {id: formData.studentId, name: formData.studentName}
    this.dialogRef.close(student);
  }

}
