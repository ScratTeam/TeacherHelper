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
  fileName: string = '';  // 学生文件
  students: { id: string, name: string }[] = [];  // 学生名单

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
    let tempCourse = new Course(courseInfoData.name, courseInfoData.classroom, courseInfoData.time);

    // 前端校验
    this.errorMessage = this.validator.checkCourseInfo(courseInfoData.name,
                                                       courseInfoData.classroom,
                                                       courseInfoData.time);
    // 未添加学生名单
    if (this.students.length == 0) this.errorMessage = '未添加学生名单';
    // 如果存在错误，则不提交
    if (this.errorMessage != '') return;

    // 向后端发送请求，创建新的课程
    this.courseService.addCourse(tempCourse, this.students).subscribe((data) => {
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
    // 重置学生名单
    this.students = [];

    // 定义文件
    var reader = new FileReader();

    // 读取学生名单的信息
    reader.onload = (e: any) => {
      let workbook = XLSX.read(e.target.result, { type: 'binary' });
      let worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let row = 1;  // 定义行号
      let ids = new Set();  // 定义学生学号的集合
      while (true) {
        console.log(1);
        // 取出第一张表
        if (worksheet['A' + row] == undefined || worksheet['A' + row] == undefined ||
            worksheet['B' + row] == null || worksheet['B' + row] == null) break;
        let id = worksheet['A' + row].v;  // 取出学号
        let name = worksheet['B' + row].v;  // 取出姓名
        row++;
        if (ids.has(id)) {
          this.snackBar.open('学生名单中有重复，已自动去重', '知道了', { duration: 2000 });
          continue;  // 根据学号对表进行去重
        }
        ids.add(id);
        this.students.push({ id: id, name: name });
      }
    };

    if (event.target.files[0] != undefined) {
      reader.readAsBinaryString(event.target.files[0]);
      this.fileName = event.target.files[0].name;
    }
  }
}
