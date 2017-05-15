// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
answerSchema = new mongoose.Schema({
	id: String,
	answer: String
});
questionSchema = new mongoose.Schema({
	type: Number,
	stem: String,
	choices: [String],
	answers: [answerSchema],
	correctStudents: [String],
});
testSchema = new mongoose.Schema({
	username: String,
  courseName: String,
	name: String,
	startTime: Date,
  endTime: Date,
  detail: String,
	questions: [questionSchema]
});
const Test = mongoose.model('Test', testSchema);

module.exports = function(app, shareData) {
  // 创建 router
  var router = new Router({ prefix: '/test' });

  // 后端校验
  testValidator = function(ctx) {
    // 重要元素为空
    if (ctx.request.body == null || ctx.request.body == undefined ||
		    ctx.request.body.test == null || ctx.request.body.test == undefined) {
      return false;
	  } else {
			let test = ctx.request.body.test;
      let courseName = test.courseName;
			let name = test.name;
			let startTime = test.startTime;
			let endTime = test.endTime;
			let detail = test.detail;
			let questions = test.questions;
      // 非题目的非法请求
      if (courseName == null || courseName == undefined || courseName == '' ||
          name == null || name == undefined || name == '' ||
          startTime == null || startTime == undefined || startTime < new Date() ||
          endTime == null || endTime == undefined || endTime < startTime ||
          detail == null || detail == undefined) {
        return false;
      } else {
				// 校验题目中的非法请求
				let isValid = true;
				questions.forEach((question) => {
					// 如果为选择题
					if (question.type == 1 || question.type == 2) {
						// 校验选项是否为空
						question.choices.forEach((choice) => {
							if (choice == '') isValid = false;
						});
						// 校验题干是否为空
						if (question.stem == '') isValid = false;
					// 如果为填空题
					} else if (question.type == 3) {
						if (question.stem == '' || question.stem.indexOf('[空]') < 0)
						  isValid = false;
					// 如果为简答题
					} else if (question.type == 4) {
						if (question.stem == '') isValid = false;
					}
				});
        return isValid;
      }
    }
  }

	// 获取测试
  router.post('/get-tests', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
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
				ctx.body = { isOK: true, tests: queryTests };
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
        ctx.body = { isOK: false, message: '401' };
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
          isOK: true,
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

	// 创建测验
	router.post('/create-test', async function(ctx, next) {
		try {
			// 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
			// 后端校验
      } else if (!testValidator(ctx)) {
				ctx.status = 403;
		  // 正常情况
			} else {
				let raw = ctx.request.body.test;
				// 检查该测试是否已存在
				let tests = await Test.find({ username: ctx.session.username,
					                            courseName: raw.courseName,
																			name: raw.name });
				if (tests.length == 0) {
					// 创建新的 test 框架
					let test = new Test({
						username: ctx.session.username,
						courseName: raw.courseName,
						name: raw.name,
						startTime: raw.startTime,
						endTime: raw.endTime,
						detail: raw.detail,
						questions: []
					});
					// 将问题放入 test
					raw.questions.forEach((question, index) => {
						test.questions[index] = {
							type: question.type,
							stem: question.stem,
							choices: question.choices,
							answers: [],
							correctStudents: []
						};
					});
					await test.save();
					ctx.body = { isOK: true };
				} else {
					ctx.body = { isOK: false, message: '该测试已存在，请使用其他的测试名' };
				}
			}
		} catch(error) {
			console.log(error);
		}
	});

  router.post('/update-test', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      // 后端校验
      } else if (!testValidator(ctx)) {
        ctx.status = 403;
      // 正常情况
      } else {
        let raw = ctx.request.body.test;
        let tests = Test.find({ username: ctx.session.username,
                                courseName: raw.courseName,
                                name: ctx.request.body.oldName});
        let tests_ = Test.find({ username: ctx.session.username,
                                courseName: raw.courseName,
                                name: raw.name});
        // 测试名未被占用
        if (tests_.length == 0 || ctx.request.body.oldName == raw.name) {
          // 更新该测试
          let test = tests[0];
          test.name = raw.name;
          test.detail = raw.detail;
          test.startTime = raw.startTime;
          test.endTime = raw.endTime;
          test.questions = [];
          // 将问题放入 test
          raw.questions.forEach((question, index) => {
            test.questions[index] = {
              type: question.type,
              stem: question.stem,
              choices: question.choices,
              answers: [],
              correctStudents: []
            }
          });
          await test.save();

          ctx.body = {
            isOK: true,
            name: test.name,
            detail: test.detail,
            startTime: test.startTime,
            endTime: test.endTime,
            questions: test.questions
          };
        // 该测试存在
        } else {
          ctx.body = { isOK: false, message:'已存在同名测试' };
        }
      }
    } catch(error) {
      console.log(error);
    }
  });

	// 在 app 中打入 routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return router;
}
