import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class CheckInService {
  // 声明必要的 request header
  public headers = new Headers({'Content-Type': 'application/json'});

  constructor(public http: Http) {}

  // 创建新的签到
  createCheckIn(courseName) {
    return this.http.post('/check-in/add-check-in',
                          { courseName: courseName },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 获取所有的签到
  getCheckIns(courseName: string) {
    return this.http.post('/check-in/get-check-ins',
                          { courseName: courseName },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 开启或者关闭签到
  toggleCheckIn(courseName: string, id: number) {
    return this.http.post('/check-in/toggle',
                          { courseName: courseName,
                            id: id },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 删除签到
  deleteCheckIn(courseName: string, id: number) {
    return this.http.post('/check-in/delete-check-in',
                          { courseName: courseName,
                            id: id },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 获取某一次签到
  getCheckIn(courseName: string, id: number, username: string) {
    return this.http.post('/check-in/get-check-in',
                          { courseName: courseName,
                            id: id,
                            username: username },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

  // 签到
  submitCheckIn(courseName: string, id: number, username: string, studentId: string) {
    return this.http.post('/check-in/submit-check-in',
                          { courseName: courseName,
                            id: id,
                            username: username,
                            studentId: studentId },
                          { headers: this.headers })
                    .map((res) => res.json());
  }

}
