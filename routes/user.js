// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
const userSchema = new mongoose.Schema({
  username: String,
  avatar: String,
  university: String,
  school: String
});
const User = mongoose.model('User', userSchema);

module.exports = function(app, shareData) {
  // 创建 router
  var router = new Router({ prefix: '/user' });

  userValidator = function(ctx) {
    // 后端校验规则
    let usernameRegex = /^[a-zA-Z0-9]+$/;  // 只能由字母和数字组成
    // Base64 编码的图片
    let avatarRegex = /^(?:data:image\/([a-zA-Z]*);base64,)?(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    // request body 为空
    if (ctx.request.body == null || ctx.request.body == undefined) {
      return false;
    } else {
      let username = ctx.request.body.username;
      let oldName = ctx.request.body.oldName;
      let avatar = ctx.request.body.avatar;
      let university = ctx.request.body.university;
      let school = ctx.request.body.school;
      // 非法请求
      if (username == null || username == undefined || username == '' ||  // 新用户名不合法
          username.length < 5 || username.length > 10 ||
          username.match(usernameRegex) == null ||
          oldName == null || oldName == undefined || oldName == '' ||  // 旧用户名不合法
          oldName.length < 5 || oldName.length > 10 ||
          oldName.match(usernameRegex) == null ||
          avatar == null || avatar == undefined ||  // 新头像不合法
          (avatar.match(avatarRegex) == null &&
           avatar != '/assets/images/default-avatar.jpg') ||
          university == null || university == undefined ||  // 新大学不合法
          school == null || school == undefined)  // 新学院不合法
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
        ctx.body = { isOK: false, message: '401' };
      } else {
        var users = await User.find({ username: ctx.session.username });
        // 如果数据库中不包含此用户名，则它为新注册用户
        if (users.length == 0) {
          // 创建新的用户
          let user = new User({
            username: ctx.session.username,
            avatar: '/assets/images/default-avatar.jpg',
            university: '',
            school: ''
          });
          await user.save();
          ctx.body = {
            isOK: true,
            username: user.username,
            avatar: user.avatar,
            university: user.university,
            school: user.school
          };
        } else {
          ctx.body = {
            isOK: true,
            username: users[0].username,
            avatar: users[0].avatar,
            university: users[0].university,
            school: users[0].school
          };
        }
      }
    } catch(error) {
      console.error(error);
    }
  });

  router.post('/update-user', async function(ctx, next) {
    try {
      // 后盾校验
      if (!userValidator(ctx)) {
        ctx.status = 403;
      } else if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else {
        let passports = await shareData.Passport.find({
          username: ctx.request.body.username
        });
        // 保证新旧用户名不同且新用户名未被用过
        if (ctx.request.body.oldName != ctx.request.body.username &&
            passports.length == 1) {
          // 新用户名已经被其他用户使用
          ctx.body = {
            isOK: false,
            message: '该用户已存在，请更换新用户名'
          };
        } else {
          let users = await User.find({ username : ctx.request.body.oldName });
          let passports = await shareData.Passport.find({
            username: ctx.request.body.oldName
          });
          // 保证该用户存在
          if (users.length == 1 && passports.length == 1) {
            // 更新用户
            let user = users[0];
            user.username = ctx.request.body.username;
            user.avatar = ctx.request.body.avatar;
            user.university = ctx.request.body.university;
            user.school = ctx.request.body.school;
            await user.save();

            // 更新凭证
            let passport = passports[0];
            passport.username = ctx.request.body.username;
            await passport.save();

            // 更新 session
            ctx.session.username = ctx.request.body.username;

            // 更新成功
            ctx.body = {
              isOK : true,
              username: ctx.request.body.username,
              avatar: ctx.request.body.avatar,
              university: ctx.request.body.university,
              school: ctx.request.body.school
            };
          // 提交了数据库中不存在的用户
          } else {
            ctx.status = 403;
          }
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
