export class User {
  username: string;
  avatar: string;
  university: string;
  school: string;

  constructor(username: string, avatar: string, university: string, school: string) {
    this.username = username;
    this.avatar = avatar;
    this.university = university;
    this.school = school;
  }
};
