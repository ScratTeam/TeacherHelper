import { Injectable } from '@angular/core';

import { Course } from './course';

@Injectable()
export class CourseService {
  courses: Course[];

  constructor() {
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
    return this.courses;
  }

  deleteCourse(course) {

  }

}
