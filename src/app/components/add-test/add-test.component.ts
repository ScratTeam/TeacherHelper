import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

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

  // 试卷相关变量
  startDate: Date = new Date();  // 考试开始时间
  endDate: Date = new Date();  // 考试结束时间
  startHour: string;  // 小时
  endHour: string;
  hours = [];
  startMin: string;  // 分钟
  endMin: string;
  minutes = [];
  questions: Question[] = [];  // 试题
  newQuestion: Question = new Question(1, '', [], []);  // 正在创建的新试题

  // 试题相关变量
  indices = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];  // 选择题选项字母
  choices = [{ value: '' }, { value: '' }];  // 选项
  questionErr: string = '';  // 添加新问题时的报错信息

  constructor(private userService: UserService, private router: Router,
              private snackBar: MdSnackBar) {
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

  // 添加新的选项
  addNewChoice() {
    if (this.choices.length >= 6) {
      this.snackBar.open('选择题选项不能超过 6 个', '知道了', { duration: 2000 });
      return;
    }
    this.choices.push({ value: '' });
  }

  // 删除某个选项
  deleteChoice(index: number) {
    if (this.choices.length <= 2) {
      this.snackBar.open('选择题选项不能少于两个', '知道了', { duration: 2000 });
      return;
    }
    this.choices.splice(index, 1);
  }

  // 清空报错信息
  clear() {
    this.newQuestion = new Question(1, '', [], []);
    this.questionErr = '';
  }

  // 提交新的问题
  submitQuestion() {
    // 如果为选择题
    if (this.newQuestion.type == 1 || this.newQuestion.type == 2) {
      let error = '';
      // 校验选项是否为空
      this.choices.forEach((choice, index) => {
        if (choice.value == '')
          error = '选择题选项不能为空，选项 ' + this.indices[index] + ' 为空';
      });
      // 校验题干是否为空
      if (this.newQuestion.stem == '')
        this.questionErr = '选择题题干不能为空';
      else if (error != '')
        this.questionErr = error;
      else
        this.questionErr = '';
    // 如果为填空题
    } else if (this.newQuestion.type == 3) {
      if (this.newQuestion.stem == '')
        this.questionErr = '填空题题干不能为空';
      else if (this.newQuestion.stem.indexOf('[空]') < 0)
        this.questionErr = '填空题题干中至少需要包含一个空';
      else
        this.questionErr = '';
    // 如果为简答题
    } else if (this.newQuestion.type == 4) {
      if (this.newQuestion.stem == '')
        this.questionErr = '简答题题干不能为空';
    }

    if (this.questionErr != '') return;
    // 为题目添加选项
    this.choices.forEach((choice) => {
      this.newQuestion.choices.push(choice.value);
    });
    console.log(this.newQuestion);
    this.questions.push(this.newQuestion);
    this.newQuestion = new Question(1, '', [], []);
  }

}
