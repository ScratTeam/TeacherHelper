import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class CheckInService {
  // 声明必要的 request header
  public headers = new Headers({'Content-Type': 'application/json'});

  constructor(public http: Http) {}

  // 创建新的签到
  createCheckIn() {
    return this.http.post('/check-in/add-check-in', {},
                          { headers: this.headers })
                    .map((res) => res.json());
  }

}
