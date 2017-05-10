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
    choices: String[],
    answers: [{
    	id: String,
    	answer: String
    }],
    correctStudents: [String],
	}]
};

const Test = mongoose.module('Test', testSchema);

module.exports = function(app, shareData) {
  // 创建 router
  var router = new Router({ prefix: '/test' });

  // TODO 后端校验
  courseValidator = function(ctx) {

  }

	// TODO 获取所有测试
  router.post('get-all-tests', async function(ctx, next) {

  });

  // TODO 获取某个测试
  router.post('get-test', async function(ctx, next) {

  });

}
