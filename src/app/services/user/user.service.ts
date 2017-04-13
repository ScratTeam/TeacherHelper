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

}
