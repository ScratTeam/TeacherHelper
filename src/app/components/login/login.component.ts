import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  signInError: string = '该用户已存在，请更改用户名或直接登录';  // 登录的校验错误
  signUpError: string = '用户名或密码错误，请再次尝试';  // 注册的校验错误

  constructor(private router: Router) {}

  ngOnInit() {}

  // 从注册页到登录页，从登录页到注册页
  changePage() {
    if (this.router.url == '/login/sign-in')
      this.router.navigate(['/login', 'sign-up']);
    else if (this.router.url == '/login/sign-up')
      this.router.navigate(['/login', 'sign-in']);
  }

}
