import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { User } from './services/user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  user: User;

  constructor(private authService: AuthService, private router: Router,
              private userService: UserService) {
    // 监听页面跳转
    this.router.events.subscribe(path => {
      // 判断是否登录
      userService.getUser().subscribe((data) => {
        if (data.isOK) this.user = new User(data.username, data.avatar, data.school, data.college);
        else this.user = null;
      });
      window.scrollTo(0, 0);
    });
  }

  // 退出登录
  signOut() {
    this.authService.signOut().subscribe((data) => {
      // 成功退出
      if (data.isOK) {
        // 删除浏览器的 cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "")
                             .replace(/=.*/, "=;expires=" +
                                      new Date().toUTCString() +
                                      ";path=/");
        });
        // 前往注册页
        this.router.navigate(['/login', 'sign-in']);
      }
    });
  }

  gotoHome() {
    if (this.user != null)
      this.router.navigate(['/home', this.user.username]);
  }

  addCourse() {
    this.router.navigate(['/add-course', this.user.username]);
  }
}
