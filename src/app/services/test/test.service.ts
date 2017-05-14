import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Test } from './test';

@Injectable()
export class TestService {
  private headers = new Headers({'Content-Type': 'application/json'});
  tests: Test[] = [];

  constructor(private http: Http) {
    this.tests = [{
      courseName: "计算机网络 I",
      name: "考勤一",
      startTime: new Date("May 11, 2017 11:13:00"),
      endTime: new Date("October 13, 2017 11:13:00"),
      detail: "",
      questions: [
        {type: 1,
         stem: "今天星期几",
         choices:["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
         answers: [{id: "14331237", answer: "0"},
                   {id: "14331182", answer: "1"}]
        }, {
          type: 2,
          stem: "你喜欢的季节",
          choices:["春季", "夏季", "秋季", "冬季"],
          answers: [{id: "14331237", answer: "0 1"},
                    {id: "14331182", answer: "1"}]
        }, {
          type: 3,
          stem: "请写出四大名著及其作者",
          choices:[],
          answers: [{id: "14331237", answer: "不知道"},
                    {id: "14331182", answer: "我不知道"},
                    {id: "1433123", answer: "不知道"}]
        }, {
          type: 4,
          stem: "请简述一下你最喜欢的书的情节",
          choices:[],
          answers: [{id: "14331237", answer: "最喜欢看杂志"},
                    {id: "14331182", answer: "最喜欢看电影"}]
        }
      ]
    }, {
      courseName: "计算机网络 I",
      name: "考勤二",
      startTime: new Date("October 11, 2017 11:13:00"),
      endTime: new Date("October 13, 2017 11:13:00"),
      detail: "",
      questions: [
        {type: 1,
         stem: "今天星期几",
         choices:["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
         answers: [{id: "14331237", answer: "0"},
                   {id: "14331182", answer: "1"}]
        }, {
          type: 2,
          stem: "你喜欢的季节",
          choices:["春季", "夏季", "秋季", "冬季"],
          answers: [{id: "14331237", answer: "0 1"},
                    {id: "14331182", answer: "1"}]
        }, {
          type: 3,
          stem: "请写出四大名著及其作者",
          choices:[],
          answers: [{id: "14331237", answer: "不知道"},
                    {id: "14331182", answer: "我不知道"},
                    {id: "1433123", answer: "不知道"}]
        }, {
          type: 4,
          stem: "请简述一下你最喜欢的书的情节",
          choices:[],
          answers: [{id: "14331237", answer: "最喜欢看杂志"},
                    {id: "14331182", answer: "最喜欢看电影"}]
        }
      ]
    }, {
      courseName: "计算机网络 I",
      name: "考勤三",
      startTime: new Date("May 11, 2017 11:13:00"),
      endTime: new Date("May 13, 2017 11:13:00"),
      detail: "",
      questions: [
        {type: 1,
         stem: "今天星期几",
         choices:["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
         answers: [{id: "14331237", answer: "0"},
                   {id: "14331182", answer: "1"}]
        }, {
          type: 2,
          stem: "你喜欢的季节",
          choices:["春季", "夏季", "秋季", "冬季"],
          answers: [{id: "14331237", answer: "0 1"},
                    {id: "14331182", answer: "1"}]
        }, {
          type: 3,
          stem: "请写出四大名著及其作者",
          choices:[],
          answers: [{id: "14331237", answer: "不知道"},
                    {id: "14331182", answer: "我不知道"},
                    {id: "1433123", answer: "不知道"}]
        }, {
          type: 4,
          stem: "请简述一下你最喜欢的书的情节",
          choices:[],
          answers: [{id: "14331237", answer: "最喜欢看杂志"},
                    {id: "14331182", answer: "最喜欢看电影"}]
        }
      ]
    }
  ];
}

  // 获取所有测试概要
  getTests(course: string) {
    // TODO 从后端获取测试信息
    // return this.http.post('/test/get-tests',
    //                       { course: course },
    //                       { headers: this.headers })
    //                 .map((res) => res.json());
    return this.tests;
  }

  // 获取某次测试
  getTest(courseName: string, testName: string) {
    // TODO 从后端获取测试的信息
    // return this.http.post('/test/get-tests',
    //                       { course: courseName, test: testName },
    //                       { headers: this.headers })
    //                 .map((res) => res.json());
    var i;
    for (i = 0; i < this.tests.length; i++) {
      if (this.tests[i].courseName == courseName && this.tests[i].name == testName)
        return this.tests[i];
    }
    return this.tests[0];
  }

  // 创建测试
  createTest(test: Test) {
    return this.http.post('/test/create-test',
                          { test: test },
                          { headers: this.headers })
                    .map((res) => res.json())
  }

}
