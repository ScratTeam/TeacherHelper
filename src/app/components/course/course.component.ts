import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { CourseService } from '../../services/course/course.service';
import { Course } from '../../services/course/course';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.sass']
})
export class CourseComponent implements OnInit {
  course: Course;

  constructor(private authService: AuthService, private router: Router,
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
      this.course = this.courseService.getCourse(params['course']);
    });
  }

}
