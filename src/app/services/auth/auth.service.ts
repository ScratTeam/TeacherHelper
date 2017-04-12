import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class AuthService {

  constructor() {}

  // 加密密码
  encryptPassword(password: string) {
    let temp: string = password;
    for (let i = 0; i < 5; i++)
      temp = String(Md5.hashStr(temp));
    return temp;
  }

  // 注册
  signUp(username: string, password: string) {
    console.log(username, password);
  }

  // 登录
  signIn(username: string, password: string) {
    console.log(username, password);
  }

  // 推出登录
  signOut() {}

}
