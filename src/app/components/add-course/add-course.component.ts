import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import * as XLSX from 'xlsx/xlsx';

import { CourseService } from '../../services/course/course.service';
import { Course } from '../../services/course/course';
import { Validator } from '../../services/course/validator';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.sass']
})
export class AddCourseComponent implements OnInit {
  course: Course;
  validator: Validator;
  errorMessage: string = '';
  fileName: string = '';

  constructor(private courseService: CourseService, private snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  addCourse(courseInfoData) {
    this.course.name = courseInfoData.name;
    this.course.classroom = courseInfoData.classroom;
    this.course.time = courseInfoData.time;
    let errorMessage = this.validator.checkCourseInfo(courseInfoData.name, courseInfoData.classroom,
                                                    courseInfoData.time);
    if (errorMessage != '') {
      this.errorMessage = errorMessage;
      return;
    }

    // TODO 在数据库中新建一个课程信息
    // this.courseService.addCourse(this.course).subscribe((data)=> {
    //   if (!data.isOK) {
    //     this.errorMessage = data;
    //   } else {
    //     this.course = data;
    //     this.snackBar.open('创建成功', '知道了', { duration: 2000 });
    //   }
    // });
  }

  uploadFile(event) {
    var reader = new FileReader();
    var that = this;

    reader.onload = function(e: any) {
      var workbook = XLSX.read(e.target.result, {type: 'binary'});
      var first_sheet_name = workbook.SheetNames[0];
      var address_of_cell = 'A1';
      var worksheet = workbook.Sheets[first_sheet_name];
      var desired_cell = worksheet[address_of_cell];
      console.log(desired_cell.v);
    };


    if (event.target.files[0] != undefined) {
      // reader.readAsDataURL(event.target.files[0]);
      reader.readAsBinaryString(event.target.files[0]);
      this.fileName = event.target.files[0].name;
    }
  }
}
