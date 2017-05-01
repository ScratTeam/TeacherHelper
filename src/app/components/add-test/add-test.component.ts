import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';
import { Question } from '../../services/test/question';

@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.sass']
})
export class AddTestComponent implements OnInit {
  user: User;  // 当前登录用户，用于身份校验和页面跳转
  startDate: Date = new Date();  // 考试开始时间
  endDate: Date = new Date();  // 考试结束时间
  // 小时
  startHour: string;
  endHour: string;
  hours = [];
  // 分钟
  startMin: string;
  endMin: string;
  minutes = [];
  // 试题
  questions: Question[] = [];

  constructor(private userService: UserService, private router: Router) {
    // 如果用户未登录，则跳转到注册登录页面
    userService.getUser().subscribe((data) => {
      if (data.isOK)
        this.user = new User(data.username, data.avatar,
                             data.university, data.school);
      else
        router.navigate(['/login', 'sign-in']);
    });
    // 填充 hours 和 minutes
    for (let i = 6; i <= 22; i++) this.hours.push(i + ' 点');
    for (let i = 0; i <= 59; i++) this.minutes.push(i + ' 分');
    this.startHour = '9 点'; this.endHour = '10 点';
    this.startMin = '30 分'; this.endMin = '15 分';
  }

  ngOnInit() {}

}
