import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Test } from './test';
import { Question } from './question';

@Injectable()
export class TestService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  // 获取所有测试概要
  getTests(course: string) {
    return this.http.post('/test/get-tests',
                          { course: course },
                          { headers: this.headers })
                    .map((res) => {
                      let temp = res.json().tests;
                      let tests: Test[] = temp;
                      return tests;
                    });
  }

  // 获取某次测试
  getTest(courseName: string, testName: string, username: string) {
    return this.http.post('/test/get-test',
                          { course: courseName, test: testName,
                            username: username },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 创建测试
  createTest(test: Test) {
    return this.http.post('/test/create-test',
                          { test: test },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 更新测试
  updateTest(test: Test, oldName: string) {
    return this.http.post('/test/update-test',
                          { test: test, oldName: oldName },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 删除测试
  deleteTest(course: string, testName: string) {
    return this.http.post('/test/delete-test',
                          { course: course, test: testName },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 提交学生的作答情况
  submitAnswers(username, course, testName, studentId, studentAnswers) {
    return this.http.post('/test/submit-answers',
                          { username: username, course: course, testName: testName, studentId: studentId, studentAnswers: studentAnswers},
                          { headers: this.headers})
                    .map((res) => res.json());

  }

}
