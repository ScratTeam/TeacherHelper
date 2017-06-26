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
  getCheckIns() {
    return this.http.post('/check-in/get-check-ins', {},
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

}
