import { Injectable } from '@angular/core';

import { User } from './user';

@Injectable()
export class UserService {
  user: User;

  constructor() {
    this.user = new User('liuren', '/assets/images/default-avatar.jpg');
  }

  getUser() {
    return this.user;
  }

}
