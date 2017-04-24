// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
const userSchema = new mongoose.Schema({
  username: String,
  avatar: String,
  school: String,
  college: String
});
const User = mongoose.model('User', userSchema);

module.exports = function(app, shareData) {
  // 创建 router
  var router = new Router({prefix: '/user'});

  validator = function(ctx) {
    // 后端校验规则
    let usernameRegex = /^[a-zA-Z0-9]+$/;  // 只能由字母和数字组成
    // request body 为空
    if (ctx.request.body == null || ctx.request.body == undefined) {
      return false;
    } else {
      let username = ctx.request.body.username;
      // 非法请求
      if (username == null || username == undefined || username == '' ||
          username.length < 5 || username.length > 10 ||
          username.match(usernameRegex) == null)
        return false;
      else
        return true;
    }
  }

  // 获取用户信息
  router.post('/get-user', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false };
      } else {
        var users = await User.find({ username: ctx.session.username });
        // 如果数据库中不包含此用户名，则它为新注册用户
        if (users.length == 0) {
          // 创建新的用户
          let user = new User({
            username: ctx.session.username,
            avatar: '/assets/images/default-avatar.jpg',
            school: '',
            college: ''
          });
          await user.save();
          ctx.body = {
            isOK: true,
            username: user.username,
            avatar: user.avatar,
            school: user.school,
            college: user.college
          };
        } else {
          ctx.body = {
            isOK: true,
            username: users[0].username,
            avatar: users[0].avatar,
            school: users[0].school,
            college: users[0].college
          };
        }
      }
    } catch(error) {
      console.error(error);
    }
  });

  router.post('/update-user', async function(ctx, next) {
    // 校验用户提交的更新信息，并在数据库中更新用户信息
    var users = await User.find({ username : ctx.request.body.oldName });
    var passports = await shareData.Passport.find({ username: ctx.request.body.username });
    var id = users[0]._id;

    try {
      // 更新信息
      if (ctx.request.body.oldName != ctx.request.body.username && passports.length == 1) {
        // 已存在的用户
        ctx.body = { isOk: false,
                     message: '用户已存在'
                   };
      } else if (validator(ctx)) {
        const users = await User.find({ _id: id });
        const user = users[0];
        user.username = ctx.request.body.username;
        user.avatar = ctx.request.body.avatar;
        user.school = ctx.request.body.school;
        user.college = ctx.request.body.college;
        await user.save();

        // 更新成功
        ctx.body = {
                      isOK : true,
                      username: ctx.request.body.username,
                      avatar: ctx.request.body.avatar,
                      school: ctx.request.body.school,
                      college: ctx.request.body.college
                    };
        // 更新 session
        ctx.session.username = ctx.request.body.username;

        // 更新 Passport
        var passports = await shareData.Passport.find({ username: ctx.request.body.oldName });
        if (passports.length == 1) {
          var id = passports[0]._id;
          passport = passports[0];
          passport.username = ctx.request.body.username;
          passport.save();
        } else {
          ctx.body = { isOK: false, message: '未注册的用户' };
        }
      } else {
        ctx.body = { isOk: false, message: '用户名格式错误' };
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
