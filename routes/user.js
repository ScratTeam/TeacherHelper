// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 从server获取共享数据shareData
var shareData = require('../server');

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
    // 通过oldName从 schema 中查找id
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
        var conditions = { _id : id };
        var update = {$set : {
            username : ctx.request.body.username,
            avatar : ctx.request.body.avatar,
            school : ctx.request.body.school,
            college : ctx.request.body.college
        }};
        var options = { upsert : true };
        User.update(conditions, update, options, function(err){
          if(err) {
            console.log(err);
          } else {
            console.log('User updated');
          }
        });
        // 更新成功
        ctx.body = {
                      isOK : true,
                      username: ctx.request.body.username,
                      avatar: ctx.request.body.avatar,
                      school: ctx.request.body.school,
                      college: ctx.request.body.college
                    };
        // 更新session
        ctx.session.username = ctx.request.body.username;

        // 更新Passport
        var passports = await shareData.Passport.find({ username: ctx.request.body.oldName });
        if (passports.length == 1) {
          var id = passports[0]._id;
          var conditions = {_id: id};
          var update = { $set: { username: ctx.request.body.username } };
          var options = { upsert: true };
          shareData.Passport.update(conditions, update, options, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log('Passport updated');
            }
          });
        }
      }else {
        ctx.body = { isOk: false,
                     message: '用户名格式错误' 
                   };
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
