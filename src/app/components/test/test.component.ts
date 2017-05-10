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
  // 该测试是否已经过期
  valid: Boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private snackBar: MdSnackBar, private testService: TestService) {
    activatedRoute.params.subscribe((params: Params) => {
      // 取回测试信息
      this.test = this.testService.getTest(params['test']);
      // 判断是否过期
      // this.valid = new Date() > this.test.endTime;
      this.valid = true;
      this.questions = this.test.questions;
      // 将分析结果初始化为隐藏
      var i;
      for (i = 0; i < this.questions.length; i++) {
        this.analyseHide.push(true);
        this.answersNumber.push(this.questions[i].answers.length);
      }
    });
  }

  ngOnInit() {}

  toDateString(date: Date) {
    return date.getFullYear() + '/' + date.getMonth() + '/' +
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

  expandLess(index) {
    this.analyseHide[index] = true;
  }

}
