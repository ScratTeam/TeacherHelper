import { Injectable } from '@angular/core';

import { Course } from './course';

@Injectable()
export class CourseService {
  course: Course;

  constructor() {
    this.course = new Course('数据结构', '公教楼 D304', '每周四第 1 到第 3 节课');
  }

  getCourse(course: string) {
    return this.course;
  }

}
