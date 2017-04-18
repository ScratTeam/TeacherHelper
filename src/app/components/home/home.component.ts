import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';
import { Validator } from '../../services/user/Validator';
import { CourseService } from '../../services/course/course.service';
import { Course } from '../../services/course/course';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  errorMessage: string = '';
  user: User;
  validator: Validator = new Validator();
  courses: Course[];

  constructor(public userService: UserService, public router: Router,
              public snackBar: MdSnackBar, public courseService: CourseService) {
    userService.getUser().subscribe((data) => {
      if (data.isOK) {
        this.user = new User(data.username, data.avatar, data.school, data.college);
        // this.courseService.getCourses().subscribe((result) => {
        //   this.courses = result;
        // });
        this.courses = this.courseService.getCourses();
      } else {
        router.navigate(['/login', 'sign-in']);
      }
    });
  }

  ngOnInit() {
  }

  avatarChange(event) {
    var reader = new FileReader();
    var that = this;

    reader.onload = function(e: any) {
      that.user.avatar = e.target.result;
    };

    if (event.target.files[0] != undefined)
      reader.readAsDataURL(event.target.files[0]);
  }

  updateUserInfo(infoData) {
    this.user.username = infoData.username;
    this.user.school = infoData.school;
    this.user.college= infoData.college;
    // 提交修改
    let errorMessage = this.validator.checkUserInfo(this.user.avatar,this.user.username,
                                                    this.user.school, this.user.college);
    if (errorMessage != '') {
      this.errorMessage = errorMessage;
      return;
    }
    // 从后端更新用户数据
    this.userService.updateUser(this.user).subscribe(
      (data) => {
        if (data.username != undefined) {
          this.user = data;
          this.snackBar.open('修改成功', '知道了', { duration: 2000 });
          this.errorMessage = '';
        } else {
          this.errorMessage = data;
        }
      }
    );
  }

  editCourse(course) {
    if (this.user != null)
      this.router.navigate(['/course', this.user.username, course.name]);
  }

}
