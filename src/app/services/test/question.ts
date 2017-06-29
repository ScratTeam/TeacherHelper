export class Question {
  type: number;
  stem: string;
  choices: string[] = [];
  answers: StudentAnswer[] = [];
  rightAnswers: string;

  constructor(type: number, stem: string, choices: string[],
              answers: StudentAnswer[], rightAnswers: string) {
    this.type = type;
    this.stem = stem;
    this.rightAnswers = rightAnswers;

    for (let element in choices) {
      this.choices.push(choices[element]);
    }
    for (let element in answers) {
      this.answers.push({ id: answers[element].id, answer: answers[element].answer });
    }
  }
}

// 学生回答类
class StudentAnswer {
  id: string;
  answer: string;
}
