import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  errorMessage: string = '';
  user: User;

  constructor(public userService: UserService) {

  }

  ngOnInit() {
  }

}
