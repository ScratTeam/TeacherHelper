// 申明依赖
const Router = require('koa-router');

module.exports = function(app) {
  // 创建 router
  var router = new Router({prefix: '/auth'});

  // 存储用户的临时变量
  var users = [];

  // 后端校验
  validator = function(ctx) {
    // 后端校验规则
    let usernameRegex = /^[a-zA-Z0-9]+$/;  // 只能由字母和数字组成
    let passwordRegex = /^[a-f0-9]{32}$/;;  // 必须满足 MD5
    // request body 为空
    if (ctx.request.body == null || ctx.request.body == undefined) {
      return false;
    } else {
      let username = ctx.request.body.username;
      let password = ctx.request.body.password;
      // 非法请求
      if (username == null || username == undefined || username == '' ||
          username.length < 5 || username.length > 10 ||
          username.match(usernameRegex) == null ||
          password == null || password == undefined || password == '' ||
          password.match(passwordRegex) == null)
        return false;
      else
        return true;
    }
  }

  // 对请求进行响应
  // 注册
  router.post('/sign-up', function(ctx, next) {
    if (!validator(ctx)) {
      ctx.status = 403;
    } else {
      ctx.body = { isOK: true };
    }
  });

  // 登录
  router.post('/sign-in', async function(ctx, next) {
    if (!validator(ctx)) {
      ctx.status = 403;
    } else {
      ctx.body = { isOK: true };
    }
  });

  // 在 app 中打入 routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return router;
}
