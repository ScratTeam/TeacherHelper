import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Course } from './course';

@Injectable()
export class CourseService {
  private headers = new Headers({'Content-Type': 'application/json'});
  courses: Course[];

  constructor(private http: Http) {
    this.courses = [{
      name: '数据结构',
      classroom: '公教楼 D304',
      time: '每周四 1-3 节课'
    },{
      name: '计算机组成原理',
      classroom: '公教楼 D301',
      time: '每周二 6-8 节课'
    },{
      name: '系统分析与设计',
      classroom: '公教楼 D301',
      time: '每周三 3-5 节课'
    },{
      name: '操作系统',
      classroom: '公教楼 D301',
      time: '每周三 3-5 节课'
    },{
      name: '编译原理',
      classroom: '公教楼 D301',
      time: '每周三 3-5 节课'
    },{
      name: '软件测试',
      classroom: '公教楼 D301',
      time: '每周三 3-5 节课'
    },{
      name: '职业规划与技术管理',
      classroom: '公教楼 D301',
      time: '每周三 3-5 节课'
    }];
  }

  getCourse(courseName: string) {
    return this.courses.find(function (course) {
      return course.name == courseName;
    });
  }

  getCourses() {
    return this.http.post('/course/get-courses', {}, { headers: this.headers })
                    .map((res) => res.json());
  }

  deleteCourse(course) {
    // TODO 在数据库中删除课程信息
  }

  updateCourse(course, oldName) {
    return this.http.post('/course/update-course',
                          { course: course, oldName: oldName },
                          { headers: this.headers })
                    .map((res) => {
                      let temp = res.json();
                      // 出现异常
                      if (!temp.isOK) return temp;
                      // 创建新的课程
                      return new Course(temp.name, temp.classroom, temp.time);
                    });
  }

  addCourse(course) {
    return this.http.post('/course/add-course', { course: course },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

}
