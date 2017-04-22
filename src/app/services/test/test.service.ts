import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Test } from './test';

@Injectable()
export class TestService {
  private headers = new Headers({'Content-Type': 'application/json'});
  tests: Test[];

  constructor(private http: Http) {
    this.tests = [{
      name: '考勤一',
      time: '2017/01/02 - 2017/01/03',
      state: '已过期',
      detail: 'none'
    },{
      name: '链表测试',
      time: '2017/08/02 - 2017/08/03',
      state: '未过期',
      detail: 'none'
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
}
