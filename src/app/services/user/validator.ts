export class Validator {
  constructor() {}

  checkUserInfo = function(image, username, university, school) {
    var errorMessage = '';

    // 定义校验规则
    let imageRegex = /^(?:data:image\/([a-zA-Z]*);base64,)?(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    let usernameRegex = /^[a-zA-Z0-9]+$/;

    // 对图片进行校验
    if (image == null || image == undefined || image == '')  // 防止为空的恶意攻击
      errorMessage = '图片不符合格式规范';
    else if (String(image).match(imageRegex) == null && String(image) != '/assets/images/default-avatar.jpg')
      errorMessage = '图片不符合格式规范';

    // 对用户名进行校验
    else if (username == null || username == undefined || username == '')  // 防止为空的恶意攻击
      errorMessage = '用户名不符合格式规范';
    else if (String(username).match(usernameRegex) == null)
      errorMessage = '用户名不符合格式规范';

    else if (university == null || university == undefined || university == '')  // 防止为空的恶意攻击
      errorMessage = '学校名不符合格式规范';

    else if (school == null || school == undefined || school == '') // 防止为空的恶意攻击
      errorMessage = '院系名不符合格式规范';

    return errorMessage;
  }
}
