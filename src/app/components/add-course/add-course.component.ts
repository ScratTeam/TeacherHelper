import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx/xlsx';

import { CourseService } from '../../services/course/course.service';
import { Course } from '../../services/course/course';
import { Validator } from '../../services/course/validator';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.sass']
})
export class AddCourseComponent implements OnInit {
  validator: Validator = new Validator();  // 课程的校验器
  user: User;  // 当前登录用户，用于身份校验和页面跳转
  errorMessage: string = '';  // 课程校验的报错
  fileName: string = '';  // 学生名单

  constructor(private courseService: CourseService, private snackBar: MdSnackBar,
              private router: Router, private userService: UserService) {
    // 如果用户未登录，则跳转到注册登录页面
    userService.getUser().subscribe((data) => {
      if (data.isOK)
        this.user = new User(data.username, data.avatar,
                             data.university, data.school);
      else
        router.navigate(['/login', 'sign-in']);
    });
  }

  ngOnInit() {}

  addCourse(courseInfoData) {
    console.log(courseInfoData.name, courseInfoData.classroom, courseInfoData.time);
    let tempCourse = new Course(courseInfoData.name, courseInfoData.classroom, courseInfoData.time);

    // 前端校验
    this.errorMessage = this.validator.checkCourseInfo(courseInfoData.name,
                                                       courseInfoData.classroom,
                                                       courseInfoData.time);
    if (this.errorMessage != '') return;

    // 向后端发送请求，创建新的课程
    this.courseService.addCourse(tempCourse).subscribe((data) => {
      // 出现异常
      if (!data.isOK) {
        // 如果凭证过期，则回到注册登录页
        if (data.message == '401') this.router.navigate(['/login', 'sign-in']);
        // 如果有其他错误，则报出
        else this.errorMessage = data.message;
      // 正常创建课程
      } else {
        this.snackBar.open('创建成功', '知道了', { duration: 2000 });
        this.router.navigate(['/home', this.user.username]);
      }
    });
  }

  // 提交 Excel 表格
  uploadFile(event) {
    var reader = new FileReader();
    var that = this;

    // TODO 读取学生名单的信息
    reader.onload = function(e: any) {
      var workbook = XLSX.read(e.target.result, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var address_of_cell = 'A1';
      var worksheet = workbook.Sheets[first_sheet_name];
      var desired_cell = worksheet[address_of_cell];
      if (desired_cell != null) console.log(desired_cell.v);
    };

    if (event.target.files[0] != undefined) {
      reader.readAsBinaryString(event.target.files[0]);
      this.fileName = event.target.files[0].name;
    }
  }
}
