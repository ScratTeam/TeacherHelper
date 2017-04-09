import { TeacherHelperPage } from './app.po';

describe('teacher-helper App', () => {
  let page: TeacherHelperPage;

  beforeEach(() => {
    page = new TeacherHelperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
