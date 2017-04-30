import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Test } from './test';

@Injectable()
export class TestService {
  private headers = new Headers({'Content-Type': 'application/json'});
  tests: Test[] = [];

  constructor(private http: Http) {
    this.tests = [{
      courseName: "嵌入式",
      name: "考勤一",
      startTime: new Date("October 11, 2017 11:13:00"),
      endTime: new Date("October 13, 2017 11:13:00"),
      detail: "",
      questions: [
        {type: 1,
         stem: "今天星期几",
         choices:["周一", "周二", "周三", "周四"],
         answers: [{id: "14331237", answer: "周一"},
                   {id: "14331182", answer: "周二"}]
        }, {
          type: 1,
          stem: "今天星期几",
          choices:["周一", "周二", "周三", "周四"],
          answers: [{id: "14331237", answer: "周一"},
                    {id: "14331182", answer: "周二"}]
        }]
      }];
  }

  getTests() {
    // TODO 从后端获取测试信息
    return this.tests;
  }

  getTest(test) {
    // TODO 从后端获取测试的信息
    return this.tests[0];
  }

  getQuestion(test) {
    return this.tests[0].questions;
  }
}
