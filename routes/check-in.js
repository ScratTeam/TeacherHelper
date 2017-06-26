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
      // 判断请求是否包含关键信息
      if (ctx.session.username == null || ctx.session.username == undefined ||
          ctx.request.body == null || ctx.request.body == undefined ||
          ctx.request.body.courseName == null || ctx.request.body.courseName == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else {
        // 正常情况
        let checkIns = await CheckIn.find({ username: ctx.session.username,
                                            courseName: ctx.request.body.courseName });
        let maxIndex = 0;
        for (let checkIn of checkIns)
          if (checkIn.id > maxIndex)
            maxIndex = checkIn.id;
        // 创建新的签到
        let newCheckIn = new CheckIn({
          username: ctx.session.username,
          courseName: ctx.request.body.courseName,
          id: maxIndex,
          state: true,
          students: []
        });
        await newCheckIn.save();
        ctx.body = { isOK: true, id: maxIndex };
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 获取签到
  router.post('/get-check-ins', async(ctx, next) => {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else {
        // 正常情况
        let checkIns = await CheckIn.find({ username: ctx.session.username });
        let queryCheckIns = [];
        checkIns.forEach((checkIn) => {
          queryCheckIns.push({
            id: checkIn.id,
            state: checkIn.state,
            students: checkIn.students
          });
        });
        ctx.body = { isOK: true, checkIns: queryCheckIns };
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 改变签到状态
  router.post('/toggle', async(ctx, next) => {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined ||
          ctx.request.body == null || ctx.request.body == undefined ||
          ctx.request.body.courseName == null || ctx.request.body.courseName == undefined ||
          ctx.request.body.id == null || ctx.request.body.id == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else {
        // 正常情况
        let checkIns = await CheckIn.find({ username: ctx.session.username,
                                            courseName: ctx.request.body.courseName,
                                            id: ctx.request.body.id });
        let checkIn = checkIns[0];
        // 开启关闭的签到，关闭开启的签到
        checkIn.state = !checkIn.state;
        // 保存更改
        await checkIn.save();
        ctx.body = { isOK: true };
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 删除签到
  router.post('/delete-check-in', async(ctx, next) => {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined ||
          ctx.request.body == null || ctx.request.body == undefined ||
          ctx.request.body.courseName == null || ctx.request.body.courseName == undefined ||
          ctx.request.body.id == null || ctx.request.body.id == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else {
        // 正常情况
        let checkIns = await CheckIn.find({ username: ctx.session.username,
                                            courseName: ctx.request.body.courseName,
                                            id: ctx.request.body.id });
        let checkIn = checkIns[0];
        await checkIn.remove();
        ctx.body = { isOK: true };
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 在 app 中打入 routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return router;
}