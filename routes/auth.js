// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
const passportSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Passport = mongoose.model('Passport', passportSchema);

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
  router.post('/sign-up', async function(ctx, next) {
    try {
      if (!validator(ctx)) {
        ctx.status = 403;
      } else {
        // 创建新的凭证
        let passport = new Passport({
          username: ctx.request.body.username,
          password: ctx.request.body.password
        });
        // 在数据库中匹配，若不存在该用户名则可以注册
        var passports = await Passport.find({ username: passport.username });
        if (passports.length == 0) {
          await passport.save();
          ctx.body = { isOK: true };
        } else {
          ctx.body = { isOK: false, message: '该用户已存在，请更换用户名或直接登录' };
        }
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 登录
  router.post('/sign-in', async function(ctx, next) {
    try {
      if (!validator(ctx)) {
        ctx.status = 403;
      } else {
        // 创建新的凭证
        let passport = new Passport({
          username: ctx.request.body.username,
          password: ctx.request.body.password
        });
        // 在数据库中匹配，若不存在该用户名则可以注册
        var passports = await Passport.find({ username: passport.username,
                                              password: passport.password });
        if (passports.length == 1) {
          // 将用户的登录信息存进 session
          ctx.session.username = passport.username;
          ctx.body = { isOK: true };
        } else {
          ctx.body = { isOK: false, message: '用户名或密码错误' };
        }
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 判断是否登录
  router.post('/verify', function(ctx, next) {
    // 如果 session 中存储了用户信息，则该用户已登录
    if (ctx.session.username != null || ctx.session.username != undefined)
      ctx.body = { isOK: true, username: ctx.session.username };
    else
      ctx.body = { isOK: false };
  });

  // 在 app 中打入 routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return router;
}
