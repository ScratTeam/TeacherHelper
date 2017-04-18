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
    }];
  }

  getCourse(course: string) {
    return this.courses[0];
  }

  getCourses() {
    return this.courses;
  }

}
