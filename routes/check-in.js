// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义签到
const checkInSchema = new mongoose.Schema({
  username: String,
  courseName: String,
  id: Number,
  state: Boolean,
  students: [String]
});
const CheckIn = mongoose.model('CheckIn', checkInSchema);

module.exports = (app, shareData) => {
  // 创建 router
  let router = new Router({ prefix: '/check-in' });

  // 创建签到
  router.post('/add-check-in', async (ctx, next) => {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else {
        console.log('add-check-in');
        ctx.body = { isOK: true };
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