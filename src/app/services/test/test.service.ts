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
      state: '已过期'
    },{
      name: '链表测试',
      time: '2017/08/02 - 2017/08/03',
      state: '未过期'
    }];
  }

  getTests() {
    return this.tests;
  }
}
