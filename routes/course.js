// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
const courseSchema = new mongoose.Schema({
  username: String,
  name: String,
  classroom: String,
  time: String,
  // TODO 课堂测验的 MongoDB ID
  // testIDs: [ObjectId],
  students: [{
    id: String,
    name: String
  }]
});
const Course = mongoose.model('Course', courseSchema);

module.exports = function(app, shareData) {
  // 创建 router
  var router = new Router({ prefix: '/course' });

  // 后端校验
  courseValidator = function(ctx) {
    // request body 为空
    if (ctx.request.body == null || ctx.request.body == undefined) {
      return false;
    } else {
      let name = ctx.req.body.course.name;
      let oldName = ctx.req.body.course.oldName;
      let classroom = ctx.req.body.course.classroom;
      let time = ctx.req.body.course.time;
      // 非法请求
      if (name == null || name == undefined ||
          oldName == null || oldName == undefined ||
          classroom == null || classroom == undefined ||
          time == null || time == undefined)
        return false;
      else
        return true;
    }
  }

  // 获取课程
  router.post('/get-courses', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else {
        var courses = await Course.find({ username: ctx.session.username });
        ctx.body = { isOK: true, courses: [] }
        await Promise.all(courses.forEach(function(course) {
          ctx.body.courses.push({
            name: course.name,
            classroom: course.classroom,
            time: course.time
          });
        }));
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 增加课程
  router.post('/add-course', async function(ctx, next) {

  });

  // 更新课程
  router.post('/update-course', async function(ctx, next) {
    try {
      // 若未通过后端校验
      if (!courseValidator(ctx)) {
        ctx.status = 403;
      // 若凭证已过期
      } else if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      // 一切正常则更新课程
      } else {
        courses = await Course.find({ name: ctx.req.body.oldName });
        // 找到该课程
        if (courses.length == 1) {
          // 更新该课程
          let course = courses[0];
          course.name = ctx.req.body.course.name;
          course.classroom = ctx.req.body.course.classroom;
          course.time = ctx.req.body.course.time;
          await course.save();

          ctx.body = {
            isOK: true,
            name: ctx.req.body.course.name,
            classroom: ctx.req.body.course.classroom,
            time: ctx.req.body.course.time
          };
        // 该课程不存在
        } else {
          ctx.status = 403;
        }
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
