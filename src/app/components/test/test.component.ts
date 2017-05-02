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
  choiceHide : Boolean[] = [];
  length: number;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private snackBar: MdSnackBar, private testService: TestService) {
    activatedRoute.params.subscribe((params: Params) => {
      // 取回测试信息
      this.test = this.testService.getTest(params['test']);
      this.questions = this.test.questions;
      var i;
      for (i = 0; i < this.questions.length; i++) {
        this.choiceHide.push(true);
      }
    });
  }

  ngOnInit() {}

  toDateString(date: Date) {
    return date.getFullYear() + '/' + date.getMonth() + '/' +
           date.getDate();
  }

  expandMore(index) {
    this.choiceHide[index] = false;
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
       data: [{
           name: 'A',
           y: 56.33
       }, {
           name: 'B',
           y: 24.03,
           sliced: true,
           selected: true
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

  expandLess(index) {
    this.choiceHide[index] = true;
  }

}
