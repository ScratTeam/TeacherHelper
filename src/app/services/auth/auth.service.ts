import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthService {
  // 声明必要的 request header
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  // 加密密码
  encryptPassword(password: string) {
    let temp: string = password;
    for (let i = 0; i < 5; i++)
      temp = String(Md5.hashStr(temp));
    return temp;
  }

  // 注册
  signUp(username: string, password: string) {
    this.http.post('/auth/sign-up',
                   { username: username,
                     password: this.encryptPassword(password) },
                   { headers: this.headers })
             .map((res) => res.json())
             .subscribe();
  }

  // 登录
  signIn(username: string, password: string) {
    this.http.post('/auth/sign-in',
                   { username: username,
                     password: this.encryptPassword(password) },
                   { headers: this.headers })
             .map((res) => res.json())
             .subscribe();
  }

  // 推出登录
  signOut() {}

}
