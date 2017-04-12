export class Validator {
  // 各 input 是否被访问过
  isSignUpUsername: boolean = false;
  isSignUpPassword: boolean = false;
  isSignUpConfirm: boolean = false;
  isSignInUsername: boolean = false;
  isSignInPassword: boolean = false;

  constructor() {}

  // 对注册表单的校验
  // flag 标识了哪个 input 被访问，-1 表示全部被访问
  signUpCheck(flag: number, formValue) {
    // 标记被访问过的 input
    if (flag == 0) this.isSignUpUsername = true;
    else if (flag == 1) this.isSignUpPassword = true;
    else if (flag == 2) this.isSignUpConfirm = true;
    else this.isSignUpUsername = this.isSignUpPassword =
         this.isSignUpConfirm = true;

    // 从表单中读出数据
    let username = formValue.username;
    let password = formValue.password;
    let confirm = formValue.confirm;

    // 对应 input 的校验正则表达式
    let usernameRegex = /^[a-zA-Z0-9]+$/;  // 只能由字母和数字组成
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;  // 必须包含至少一个字母和一个数字

    // 对用户名进行校验
    if (this.isSignUpUsername) {
      if (username == null || username == undefined || username == '')
        return '用户名不能为空';
      else if (username.length < 5 || username.length > 10)
        return '用户名长度需在 5 到 10 之间';
      else if (username.match(usernameRegex) == null)
        return '用户名只能由字母和数字组成';
    }

    // 对密码进行校验
    if (this.isSignUpPassword) {
      if (password == null || password == undefined || password == '')
        return '密码不能为空';
      else if (password.length < 8 || password.length > 20)
        return '密码长度需在 8 到 20 之间';
      else if (password.match(passwordRegex) == null)
        return '密码必须包含至少一个字母和一个数字';
    }

    // 对确认密码进行校验
    if (this.isSignUpConfirm) {
      if (confirm != password) return '两次输入的密码不一致';
    }

    return '';
  }

  // 对登录表单的校验
  // flag 标识了哪个 input 被访问，-1 表示全部被访问
  signInCheck(flag: number, formValue) {
    // 标记被访问过的 input
    if (flag == 0) this.isSignInUsername = true;
    else if (flag == 1) this.isSignInPassword = true;
    else this.isSignInUsername = this.isSignInPassword = true;

    // 从表单中读出数据
    let username = formValue.username;
    let password = formValue.password;

    // 对应 input 的校验正则表达式
    let usernameRegex = /^[a-zA-Z0-9]+$/;  // 只能由字母和数字组成
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;  // 必须包含至少一个字母和一个数字

    // 对用户名进行校验
    if (this.isSignInUsername) {
      if (username == null || username == undefined || username == '' ||
          username.length < 5 || username.length > 10 ||
          username.match(usernameRegex) == null)
        return '用户名不符合规范';
    }

    // 对密码进行校验
    if (this.isSignInPassword) {
      if (password == null || password == undefined || password == '' ||
          password.length < 8 || password.length > 20 ||
          password.match(passwordRegex) == null)
        return '密码不符合规范';
    }

    return '';
  }

}
