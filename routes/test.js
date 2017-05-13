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
      let courseName = ctx.request.body.courseName;
      let name = ctx.request.body.name;
      let startTime = ctx.request.body.startTime;
      let endTime = ctx.request.body.endTime;
      let questions = ctx.request.body.questions;
      // 非法请求
      if (courseName == null || courseName == undefined ||
        name == null || name == undefined ||
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
  router.post('get-tests', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOk: false, message: '401' };
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
        ctx.request.body.courseName == null || ctx.request.body.courseName == undefined) {
        ctx.status = 403;
      } else {
        let tests = await Test.find({
          username: ctx.session.username,
          courseName: ctx.request.courseName 
        });
        ctx.body = { isOk: true, tests:[] };
        tests.foreach(function(test) {
          ctx.body.tests.push({
            name: test.name,
            detail: test.detail,
            startTime: test.startTime,
            endTime: test.endTime,
            questions: test.questions
          });
        });
      }
    } catch(error) {
      console.log(error);
    }
  });

  // 获取单个测试
  router.post('get-test', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOk: false, message: '401' };
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
        ctx.request.body.courseName == null || ctx.request.body.courseName == undefined ||
        ctx.request.body.name == null || ctx.request.body.name == undefined) {
        ctx.status = 403;
      } else {
        let tests = await Test.find({ 
          username: ctx.session.username,
          courseName: ctx.request.body.courseName,
          name: ctx.request.body.name });
        let test = tests[0];
        ctx.body = {
          isOk: true,
          name: test.name,
          startTime: test.startTime,
          endTime: test.endTime,
          detail: test.detail,
          questions: test.questions
        }
      }
    } catch(error) {
      console.log(error);
    }
  });


}
