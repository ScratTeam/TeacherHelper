// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
testSchema = {
	username: String,
  courseName: String,
	name: String,
	startTime: Date,
  endTime: Date,
  detail: String,
	questions: [{
    type: Number,
    stem: String,
    choices: [String],
    answers: [{
    	id: String,
    	answer: String
    }],
    correctStudents: [String],
	}]
};
const Test = mongoose.model('Test', testSchema);

module.exports = function(app, shareData) {
  // 创建 router
  var router = new Router({ prefix: '/test' });

  // 后端校验
  testValidator = function(ctx) {
    // request body 为空
    if (ctx.request.body == null || ctx.request.body == undefined) {
      return false;
    }
    // 其他校验
    else {
      let name = ctx.request.body.name;
      let startTime = ctx.request.body.startTime;
      let endTime = ctx.request.body.endTime;
      let questions = ctx.request.body.questions;
      // 非法请求
      if (name == null || name == undefined ||
        startTime == null || startTime == undefined ||
        endTime == null || endTime == undefined ||
        questions == null || questions == undefined ||
        endTime < startTime) {
        return false;
      } else {
        return true;
      }
    }
  }

	// 获取测试
  router.post('/get-tests', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOk: false, message: '401' };
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
                 ctx.request.body.course == null || ctx.request.body.course == undefined) {
        ctx.status = 403;
      } else {
				// 从请求中取出课程名
        let course = ctx.request.body.course;
        // 通过 course 查找测试
        let tests = await Test.find({ username: ctx.session.username,
					                            courseName: course });
				let queryTests = [];
        tests.forEach(function(test) {
          queryTests.push({
            name: test.name,
            startTime: test.startTime,
            endTime: test.endTime,
						detail: test.detail,
            questions: test.questions
          });
        });
				ctx.body = { isOk: true, tests: queryTests };
      }
    } catch(error) {
      console.log(error);
    }
  });

  // 获取单个测试
  router.post('/get-test', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOk: false, message: '401' };
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
                 ctx.request.body.course == null || ctx.request.body.course == undefined ||
                 ctx.request.body.test == null || ctx.request.body.test == undefined) {
        ctx.status = 403;
      } else {
				// 从请求中取出课程名和测试名
        let course = ctx.request.body.course;
				let test = ctx.request.body.test;
        // 通过 course 查找测试
        let tests = await Test.find({ username: ctx.session.username,
					                            courseName: course, name: test });
        ctx.body = {
          isOk: true,
          name: tests[0].name,
          startTime: tests[0].startTime,
          endTime: tests[0].endTime,
          detail: tests[0].detail,
          questions: tests[0].questions
        }
      }
    } catch(error) {
      console.log(error);
    }
  });
}
