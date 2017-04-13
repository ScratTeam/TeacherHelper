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
    userService.getUser().subscribe((data) => {
      if (data != null && data != undefined) this.user = data;
    });
  }

  // 退出登录
  signOut() {
    this.authService.signOut().subscribe((data) => {
      // 成功退出
      if (data.isOK) {
        // 删除浏览器的 cookies
        document.cookie.split(";").forEach(function(c) {
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
}
