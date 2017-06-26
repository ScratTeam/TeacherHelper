export class CheckIn {
  courseName: string;
  state: boolean;
  students: string[] = [];
  id: number;

  constructor(courseName: string, state: boolean, students: string[], id: number) {
    this.courseName = courseName;
    this.state = state;
    for (let student in students) {
      this.students.push(student);
    }
    this.id = id;
  }
};
