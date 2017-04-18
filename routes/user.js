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

module.exports = function(app) {
  // 创建 router
  var router = new Router({prefix: '/user'});

  // TODO 后端校验

  // TODO 对请求进行响应
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
    // TODO 校验用户提交的更新信息，并在数据库中更新用户信息
    // 注意用户名可以更新，mongodb中每一个 schema 都有 id，以 id 为主键
    ctx.body = {username: ctx.request.body.username};
  });

  // 在 app 中打入 routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return router;
}
