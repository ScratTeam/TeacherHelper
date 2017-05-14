// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
testSchema = {
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
        ctx.request.body.testIDs == null || ctx.request.body.testIDs == undefined) {
        ctx.status = 403;
      } else {
        var query_tests = [];
        let testIDs = ctx.request.body.testIDs;
        // 通过 testID 查找测试
        for(var i = 0; i < testIDs.length; i++) {
          let tests = await Test.find({ _id: testIDs[i] });
          if (tests.length == 1) {
            query_tests.push(tests[0]);
          }else {
            ctx.body = { isOk: false, message: '该测试不存在' };
          }
        }
        if (query_tests.length > 0) {
          ctx.body = { isOk: true, query_tests:[] };
          query_tests.forEach(function(test) {
            ctx.body.tests.push({
              name: test.name,
              detail: test.detail,
              startTime: test.startTime,
              endTime: test.endTime,
              questions: test.questions
            });
          });
          // 课程还没有测试
        } else {
          ctx.body = { isOk: true, tests:[] };
        }
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
        ctx.request.body.testIDs == null || ctx.request.body.testIDs == undefined ||
        ctx.request.body.testIDs.length == 0 ||
        ctx.request.body.name == null || ctx.request.body.name == undefined) {
        ctx.status = 403;
      } else {
        var query_tests = [];
        let testIDs = ctx.request.body.testIDs;
        // 通过 testIDs 和测试的名字查询测试
        for (var i = 0; i < testIDs.length; i++) {
          let tests = await Test.find({
            _id: testIDs[i],
            name: ctx.request.body.name
          });
          if (tests.length == 1) {
            query_tests.push(tests[0]);
          }
        }
        if (query_tests.length == 1) {
          let test = query_tests[0];
          ctx.body = {
            isOk: true,
            name: test.name,
            startTime: test.startTime,
            endTime: test.endTime,
            detail: test.detail,
            questions: test.questions
          }
        } else if (query_tests.length == 0) {
          ctx.body = { isOk: false, message: '该测试不存在' };
        } else {
          ctx.body = { isOk: false, message: '同一课程下存在相同名字的测试' };
        }
      }
    } catch(error) {
      console.log(error);
    }
  });

}
