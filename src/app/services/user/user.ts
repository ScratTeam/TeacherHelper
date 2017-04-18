export class User {
  username: string;
  avatar: string;
  school: string;
  college: string;

  constructor(username: string, avatar: string, school: string, college: string) {
    this.username = username;
    this.avatar = avatar;
    this.school = school;
    this.college = college;
  }
};
