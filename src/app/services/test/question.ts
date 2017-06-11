export class Question {
  type: number;
  stem: string;
  choices: string[] = [];
  answers: StudentAnswer[] = [];

  constructor(type: number, stem: string, choices: string[],
              answers: StudentAnswer[]) {
    this.type = type;
    this.stem = stem;
    for (var element in choices) {
      this.choices.push(choices[element]);
    }
    for (var element in answers) {
      this.answers.push({ id: answers[element].id, answer: answers[element].answer });
    }
  }
}

// 学生回答类
class StudentAnswer {
  id: string;
  answer: string;
}
