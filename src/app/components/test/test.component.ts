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
  choiceHide : Boolean = true;
  analyseHide : Boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private snackBar: MdSnackBar, private testService: TestService) {
    activatedRoute.params.subscribe((params: Params) => {
      // 取回测试信息
      this.test = this.testService.getTest(params['test']);
      this.questions = this.test.questions;
    });
  }

  ngOnInit() {}

  toDateString(date: Date) {
    return date.getFullYear() + '/' + date.getMonth() + '/' +
           date.getDate();
  }

  expandMore() {
    this.choiceHide = false;
  }

  expandLess() {
    this.choiceHide = true;
  }

}
