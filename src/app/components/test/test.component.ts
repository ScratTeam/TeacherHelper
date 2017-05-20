import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { Test } from '../../services/test/test';
import { Question } from '../../services/test/question';
import { TestService } from '../../services/test/test.service';

declare var Highcharts: any;

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

  // 页面状态
  valid: number;  // 值为 -1 表示未开始，值为 0 表示正在进行，值为 1 表示已结束
  isAuth: boolean;  // true 为老师，false 为学生

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private snackBar: MdSnackBar, private testService: TestService) {
    activatedRoute.params.subscribe((params: Params) => {
      // 取回测试信息
      let that = this;
      this.testService.getTest(params['course'], params['test']).subscribe((data) => {
        // 装载数据
        that.test = data;
        that.questions = that.test.questions;
        // 判断用户
        isAuth = data.isOK;
        // 判断考试的时间
        let current = new Date();
        if (current < new Date(that.test.startTime))
          that.valid = -1;
        else if (current <= new Date(that.test.endTime))
          that.valid = 0;
        else
          that.valid = 1;
        // 将分析结果初始化为隐藏
        for (let i = 0; i < that.questions.length; i++) {
          that.analyseHide.push(true);
          that.answersNumber.push(that.questions[i].answers.length);
        }
      });
    });
  }

  ngOnInit() {}

  toDateString(date_: Date) {
    let date = new Date(date_);
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' +
           date.getDate();
  }

  expandMore(index) {
    this.analyseHide[index] = false;
    var myQuestion = this.questions[index];
    // 如果是选择题，则用饼状图显示每个选项的答题人数
    if (myQuestion.type == 1 || myQuestion.type == 2) {
      // 预处理
      var myChoicesLength = myQuestion.choices.length;
      var data = [];
      var myChoices = [];
      var i, j;
      // 初始化计数器
      for (i = 0; i < myChoicesLength; i++) {
        myChoices.push(0);
      }
      // 计算每个选项选择的人数
      for (i = 0; i < this.answersNumber[index]; i++) {
        var muitiAnswer = (myQuestion.answers[i].answer).split(' ');
        for (j = 0; j < muitiAnswer.length; j++)
          myChoices[parseInt(muitiAnswer[j])]++;
      }
      for (i = 0; i < myChoicesLength; i++) {
        data.push({name: String.fromCharCode(65 + i), y: myChoices[i]/(this.answersNumber[index])});
      }
      var myChart = Highcharts.chart(String(index), {
        chart: {
          type: 'column'
        },
        title: {
          text: '第' + String(index + 1) + '题答题情况'
        },
        legend: {
          enabled: false
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: '该选项选择人数占总人数的百分比'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> <br/>'
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y:.1f}%'
            }
          }
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: data
        }]
      });
    }
    // 如果是填空题，显示答题的情况
    else if (myQuestion.type == 3) {
      // 预处理，对答案计数，显示出最高频的几个答案及其百分比
      var myAnswers = myQuestion.answers;
      var myAnswerCount = {};
      var i;
      for (i = 0; i < myAnswers.length; i++) {
        var tempAnswer = myAnswers[i].answer;
        if (tempAnswer in myAnswerCount) {
          myAnswerCount[tempAnswer]++;
        } else {
          myAnswerCount[tempAnswer] = 1;
        }
      }
      var resultCount = [];
      for (var element in myAnswerCount) {
        resultCount.push({name: element, y: (myAnswerCount[element])*100/this.answersNumber[index]});
      }
      resultCount.sort(function(x, y) {
        return (x.count > y.count) ? 1: -1;
      });
      // 使用饼状图显示数据
      var myChart = Highcharts.chart(String(index), {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: '第'+String(index+1)+'题答题情况'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
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
          data: resultCount
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
    // TODO 校验学生的学号和姓名是否在该课程的数据库中
  }

}
