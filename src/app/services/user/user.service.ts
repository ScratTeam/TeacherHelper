import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { User } from './user';

@Injectable()
export class UserService {
  // 声明必要的 request header
  private headers = new Headers({'Content-Type': 'application/json'});

  user: User;

  constructor(private http: Http) {}

  getUser() {
    return this.http.post('/user/get-user', {}, { headers: this.headers })
                    .map((res) => res.json());
  }

  updateUser(user, oldName) {
    return this.http.post('/user/update-user',
                          {username: user.username, avatar: user.avatar,
                           school: user.school, college: user.college, oldName: oldName},
                          {headers: this.headers})
                    .map((res) => {
                      let temp = res.json();
                      if (temp == 'INVALID_REQUEST' || temp.username == undefined) {
                        console.log(temp);
                        return temp;
                      }
                      // 创建新的用户
                      return new User(temp.username, temp.avatar, temp.school, temp.college);
                    });
  }

}
