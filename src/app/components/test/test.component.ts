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
      this.valid = new Date() > this.test.endTime;
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
    // 如果是选择题，则用饼状图显示每个选项的答题人数
    if (this.questions[index].type == 1 || this.questions[index].type == 2) {
      var myChart = Highcharts.chart(String(index), {
      chart: {
         type: 'column'
      },
      title: {
         text: '第'+String(index+1)+'题答题情况'
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
         data: [{
             name: 'A',
             y: 56.33
         }, {
             name: 'B',
             y: 24.03
         }, {
             name: 'C',
             y: 10.38
         }, {
             name: 'D',
             y: 5.88
         }]
       }]
      });
    }
    // TODO 如果是填空题或者简答题，显示答题的情况
    // else if (this.questions[index].type == 3 || this.questions[index].type == 4) {
    //
    // }
  }

  expandLess(index) {
    this.analyseHide[index] = true;
  }

}
