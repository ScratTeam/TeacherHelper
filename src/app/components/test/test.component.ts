import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { Test } from '../../services/test/test';
import { TestService } from '../../services/test/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent implements OnInit {
  test: Test;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private snackBar: MdSnackBar, private testService: TestService) {
    activatedRoute.params.subscribe((params: Params) => {
      // 取回课程信息
      this.test = this.testService.getTest(params['test']);
    });
  }

  ngOnInit() {
  }

}
