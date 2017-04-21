export class Validator {
  constructor() {}

  checkCourseInfo = function(name, classroom, time) {
    var errorMessage = '';

    // 对课程名称进行校验
    if (name == null || name == undefined || name == '')  // 防止为空的恶意攻击
      errorMessage = '课程名不符合格式规范';

    // 对课室名称进行校验
    else if (classroom == null || classroom == undefined || classroom == '')  // 防止为空的恶意攻击
      errorMessage = '课室名称不符合格式规范';

    // 对课程时间进行校验
    else if (time == null || time == undefined || time == '') // 防止为空的恶意攻击
      errorMessage = '课程时间不符合格式规范';

    return errorMessage;
  }
}
