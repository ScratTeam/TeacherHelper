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

  // 存入 shareData
  shareData.CheckIn = CheckIn;

  // 创建签到
  router.post('/add-check-in', async (ctx, next) => {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      // 判断请求是否包含关键信息
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
                 ctx.request.body.courseName == null || ctx.request.body.courseName == undefined) {
        ctx.status = 403;
      } else {
        // 正常情况
        let checkIns = await CheckIn.find({ username: ctx.session.username,
                                            courseName: ctx.request.body.courseName });
        let maxIndex = 0;
        for (let checkIn of checkIns)
          if (checkIn.id > maxIndex)
            maxIndex = checkIn.id;
        maxIndex++;
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
      // 判断请求是否包含关键信息
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
                 ctx.request.body.courseName == null || ctx.request.body.courseName == undefined) {
        ctx.status = 403;
      } else {
        // 正常情况
        let checkIns = await CheckIn.find({ username: ctx.session.username,
                                            courseName: ctx.request.body.courseName });
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
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      // 判断请求是否包含关键信息
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
                 ctx.request.body.courseName == null || ctx.request.body.courseName == undefined ||
                 ctx.request.body.id == null || ctx.request.body.id == undefined) {
        ctx.status = 403;
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
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      // 判断请求是否包含关键信息
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
                 ctx.request.body.courseName == null || ctx.request.body.courseName == undefined ||
                 ctx.request.body.id == null || ctx.request.body.id == undefined) {
        ctx.status = 403;
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

  // 获得某一次签到
  router.post('/get-check-in', async(ctx, next) => {
    try {
      // 判断请求是否包含关键信息
      if (ctx.request.body == null || ctx.request.body == undefined ||
          ctx.request.body.courseName == null || ctx.request.body.courseName == undefined ||
          ctx.request.body.id == null || ctx.request.body.id == undefined ||
          ctx.request.body.username == null || ctx.request.body.username == undefined) {
        ctx.status = 403;
      // 若请求不包含用户名，则未授权
      } else if (ctx.session.username == null || ctx.session.username == undefined) {
        // 学生获取信息
        let checkIns = await CheckIn.find({ username: ctx.request.body.username,
                                            courseName: ctx.request.body.courseName,
                                            id: ctx.request.body.id });
        let checkIn = checkIns[0];
        ctx.body = { isOK: false, state: checkIn.state };
      // 判断请求是否包含关键信息
      } else {
        // 老师获取信息
        let checkIns = await CheckIn.find({ username: ctx.request.body.username,
                                            courseName: ctx.request.body.courseName,
                                            id: ctx.request.body.id });
        let checkIn = checkIns[0];
        let courses = await shareData.Course.find({ username: ctx.request.body.username,
                                                    name: ctx.request.body.courseName });
        let students = courses[0].students;
        for (let i = 0; i < checkIn.students.length; i++) {
          for (let student_ of students) {
            if (student_.id == checkIn.students[i]) {
              checkIn.students[i] = {
                id: student_.id,
                name: student_.name
              };
              break;
            }
          }
        };
        ctx.body = { isOK: true, checkIn: checkIn };
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 学生签到
  router.post('/submit-check-in', async(ctx, next) => {
    try {
      if (ctx.request.body == null || ctx.request.body == undefined ||
          ctx.request.body.username == null || ctx.request.body.username == undefined ||
          ctx.request.body.courseName == null || ctx.request.body.courseName == undefined ||
          ctx.request.body.id == null || ctx.request.body.id == undefined ||
          ctx.request.body.studentId == null || ctx.request.body.studentId == undefined) {
        ctx.status = 403;
      } else {
        // 正常情况
        let checkIns = await CheckIn.find({ username: ctx.request.body.username,
                                            courseName: ctx.request.body.courseName,
                                            id: ctx.request.body.id });
        let checkIn = checkIns[0];
        if (checkIn.students.indexOf(ctx.request.body.studentId) == -1)
          checkIn.students.push(ctx.request.body.studentId);
        // 保存更改
        await checkIn.save();
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
