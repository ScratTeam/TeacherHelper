import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { Test } from '../../services/test/test';
import { Question } from '../../services/test/question';
import { TestService } from '../../services/test/test.service';
import { CourseService } from '../../services/course/course.service';

declare let Highcharts: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent implements OnInit {
  test: Test;
  options: any;
  questions: Question[];
  // 是否显示分析结果
  analyseHide : Boolean[] = [];
  // 答题人数
  answersNumber: number[] = [];

  // 学生答题信息
  courseName: string = "";
  testName: string = "";
  username: string = "";
  studentName: string = "";
  studentId: string = "";
  studentAnswers: any[] = [];

  // 页面状态
  valid: number;  // 值为 -1 表示未开始，值为 0 表示正在进行，值为 1 表示已结束
  isAuth: boolean;  // true 为老师，false 为学生

  // 表格
  charts: any = [];

  isLoaded: boolean = false;

  constructor(public router: Router, public activatedRoute: ActivatedRoute,
              public snackBar: MdSnackBar, public testService: TestService,
              public courseService: CourseService) {
    this.isLoaded = false;
    activatedRoute.params.subscribe((params: Params) => {
      this.courseName = params['course'];
      this.testName = params['test'];
      this.username = params['username'];
      this.getTestAndDisplay(true);
      // 等待取回身份
      let requestLoop = setInterval(() => {
        if (this.isAuth != undefined && this.isAuth != null) {
          this.isLoaded = true;
          clearInterval(requestLoop);
          // 轮询
          if (this.isAuth == true) {
            setInterval(() => {
              this.getTestAndDisplay(false);
            }, 2000);
          }
        }
      }, 100);
    });
  }

  getTestAndDisplay(isInit: boolean) {
    // 取回测试信息
    this.testService.getTest(this.courseName, this.testName, this.username).subscribe((data) => {
      // 如果是第一次请求
      if (isInit) {
        // 装载数据
        this.test = data;
        this.questions = this.test.questions;
        for (let i = 0; i < this.questions.length; i++)
          this.studentAnswers.push([]);
        // 改变填空题的空的显示
        for (let question of this.questions)
          if (question.type == 3)
            question.stem = question.stem.replace('[空]', ' _____ ');
        // 更新答题人数
        for (let i = 0; i < this.questions.length; i++)
          this.answersNumber.push(this.questions[i].answers.length);
        // 判断用户
        this.isAuth = data.isOK;
        // 判断考试的时间
        let current = new Date();
        if (current < new Date(this.test.startTime)) this.valid = -1;
        else if (current <= new Date(this.test.endTime)) this.valid = 0;
        else this.valid = 1;
        // 将分析结果初始化为隐藏
        for (let i = 0; i < this.questions.length; i++)
          this.analyseHide.push(true);
      // 如果不是第一次请求
      } else {
        for (let i = 0; i < this.questions.length; i++)
          this.questions[i].answers = data.questions[i].answers;
        for (let i = 0; i < this.questions.length; i++) {
          if (this.charts[i] != null && this.charts[i] != undefined) {
            if (this.questions[i].type == 1 || this.questions[i].type == 2)
              this.charts[i].series[0].update({ data: this.calculateChoiceData(i) });
            else if (this.questions[i].type == 3)
              this.charts[i].series[0].update({ data: this.calculateCompletionData(i) });
          }
        }
      }
    });
  }

  ngOnInit() {}

  toDateString(date_: Date) {
    let date = new Date(date_);
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' +
           date.getDate();
  }

  // 计算选择题绑定到图表的数据
  calculateChoiceData(index) {
    let myQuestion = this.questions[index];
    // 预处理
    let myChoicesLength = myQuestion.choices.length;
    let data = [];
    let myChoices = [];
    // 初始化计数器
    for (let i = 0; i < myChoicesLength; i++) myChoices.push(0);
    // 计算每个选项选择的人数
    for (let i = 0; i < this.answersNumber[index]; i++) {
      let muitiAnswer = (myQuestion.answers[i].answer).split(' ');
      for (let j = 0; j < muitiAnswer.length; j++) {
        if (muitiAnswer[j] in myChoices) myChoices[muitiAnswer[j]]++;
        else myChoices[muitiAnswer[j]] = 1;
      }
    }
    for (let i = 0; i < myChoicesLength; i++)
      data.push({ name: String.fromCharCode(65 + i),
                  y: myChoices[myQuestion.choices[i]] / (this.answersNumber[index]) });
    return data;
  }

  // 计算填空题绑定到图表的数据
  calculateCompletionData(index) {
    let myQuestion = this.questions[index];
    // 预处理，对答案计数，显示出最高频的几个答案及其百分比
    let myAnswers = myQuestion.answers;
    let myAnswerCount = {};
    for (let i = 0; i < myAnswers.length; i++) {
      let tempAnswer = myAnswers[i].answer;
      if (tempAnswer in myAnswerCount)
        myAnswerCount[tempAnswer]++;
      else
        myAnswerCount[tempAnswer] = 1;
    }
    let resultCount = [];
    for (let element in myAnswerCount)
      resultCount.push({ name: element,
                         y: (myAnswerCount[element]) * 100 / this.answersNumber[index] });
    resultCount.sort((x, y) => {
      return (x.count > y.count) ? 1 : -1;
    });
    return resultCount;
  }

  expandMore(index) {
    this.analyseHide[index] = false;
    // 如果是选择题，则用饼状图显示每个选项的答题人数
    let myQuestion = this.questions[index];
    if (myQuestion.type == 1 || myQuestion.type == 2) {
      this.charts[index] = Highcharts.chart(String(index), {
        chart: { type: 'column' },
        title: { text: '第' + String(index + 1) + '题答题情况' },
        legend: { enabled: false },
        xAxis: { type: 'category' },
        yAxis: { title: { text: '该选项选择人数占总人数的百分比' } },
        tooltip: {
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> <br/>'
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: { enabled: true, format: '{point.y:.1f}%' }
          }
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: this.calculateChoiceData(index)
        }]
      });
    // 如果是填空题，显示答题的情况
    } else if (myQuestion.type == 3) {
      // 使用饼状图显示数据
      this.charts[index] = Highcharts.chart(String(index), {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: { text: '第' + String(index + 1) + '题答题情况' },
        tooltip: { pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>' },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: this.calculateCompletionData(index)
        }]
      });
    }
  }

  // 隐藏题目显示
  expandLess(index) {
    this.analyseHide[index] = true;
  }

  // 有效时可以提交题目按钮
  submitTest() {
    if (this.studentId != '' && this.studentName != '') {
      this.courseService.checkStudent(this.username, this.courseName, this.studentId, this.studentName)
                        .subscribe((data) => {
        if (data.isOK) {
          if (data.exist) {
            let submitAnswers = [];
            for (let i = 0; i < this.studentAnswers.length; i++)
              submitAnswers[i] = this.studentAnswers[i];
            for (let i = 0; i < this.questions.length; i++) {
              if (this.questions[i].type == 2) {
                let tempAnswer = '';
                for (let j = 0; j < this.questions[i].choices.length; j++) {
                  if (this.studentAnswers[i][j] == true) {
                    tempAnswer = tempAnswer + (this.questions[i].choices[j]) + ' ';
                  }
                }
                submitAnswers[i] = tempAnswer.substring(0, tempAnswer.length-1);
              }
            }
            this.testService.submitAnswers(this.username, this.courseName,
                                           this.testName, this.studentId, submitAnswers).subscribe();
          } else {
            this.snackBar.open('你尚未加入本课程', '知道了', { duration: 2000 });
          }
        }
      });
    } else {
      this.snackBar.open('学号和姓名不能为空', '知道了', { duration: 2000 });
    }
  }

}
