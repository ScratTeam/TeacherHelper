import { Question } from './question';

export class Test {
  courseName: string;
  name: string;
  startTime: Date;
  endTime: Date;
  detail: string;
  questions: Question[] = [];

  constructor(courseName: string, name: string, startTime: Date, endTime: Date, detail: string, questions: Question[]) {
    this.courseName = courseName;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.detail = detail;
    for (let element in questions) {
      this.questions.push(new Question(questions[element].type, questions[element].stem,
                          questions[element].choices, questions[element].answers,
                          questions[element].rightAnswers));
    }
  }
};
