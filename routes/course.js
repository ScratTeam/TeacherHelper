// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
const courseSchema = new mongoose.Schema({
  name: String,
  classrome: String,
  time: String
});
const Course = mongoose.model('Course', courseSchema);

module.exports = function(app, shareData) {
  // 创建 router
  var router = new Router({prefix: '/course'});

  router.post('/update-course', async function(ctx, next) {
    // TODO 更新课程信息
    ctx.body = {isOk: true};
  });

  return router;
}
