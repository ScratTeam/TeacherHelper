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
    // request body 为空或 course 为空
    if (ctx.request.body == null || ctx.request.body == undefined ||
        ctx.request.body.course == null || ctx.request.body.course == undefined) {
      return false;
    // 其他校验
    } else {
      let name = ctx.request.body.course.name;
      let oldName = ctx.request.body.oldName;
      let classroom = ctx.request.body.course.classroom;
      let time = ctx.request.body.course.time;
      // 非法请求
      if (name == null || name == undefined ||
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
        let courses = await Course.find({ username: ctx.session.username });
        ctx.body = { isOK: true, courses: [] };
        courses.forEach(function(course) {
          ctx.body.courses.push({
            name: course.name,
            classroom: course.classroom,
            time: course.time
          });
        });
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 获取某一门课程
  router.post('/get-course', async function(ctx, next) {
    try {
      // 若请求不包含用户名，则未授权
      if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else if (ctx.request.body == null || ctx.request.body == undefined ||
                 ctx.request.body.name == null ||
                 ctx.request.body.name == undefined) {
        ctx.status = 403;
      } else {
        let courses = await Course.find({
          username: ctx.session.username,
          name: ctx.request.body.name
        });
        let course = courses[0];
        ctx.body = {
          isOK: true,
          name: course.name,
          classroom: course.classroom,
          time: course.time
        }
      }
    } catch(error) {
      console.error(error);
    }
  });

  // 增加课程
  router.post('/add-course', async function(ctx, next) {
    try {
      // 若未通过后端校验
      if (!courseValidator(ctx)) {
        ctx.status = 403;
      // 若请求不包含用户名，则未授权
      } else if (ctx.session.username == null || ctx.session.username == undefined) {
        ctx.body = { isOK: false, message: '401' };
      } else {
        var courses = await Course.find({
          username: ctx.session.username,
          name: ctx.request.body.course.name
        });
        // 如果数据库中不包含此课程，则可以创建
        if (courses.length == 0) {
          // 创建新的课程
          let course = new Course({
            username: ctx.session.username,
            name: ctx.request.body.course.name,
            classroom: ctx.request.body.course.classroom,
            time: ctx.request.body.course.time,
            testIDs: [],
            students: []
          });
          await course.save();
          ctx.body = { isOK: true };
        // 数据库中已经包含此课程
        } else {
          ctx.body = { isOK: false, message: '课程名已存在，请更换新课程名' };
        }
      }
    } catch(error) {
      console.error(error);
    }
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
        courses = await Course.find({ name: ctx.request.body.oldName });
        courses_ = await Course.find({ name: ctx.request.body.course.name });
        // 课程名未被用过
        if (courses_.length == 0 ||
            ctx.request.body.oldName == ctx.request.body.course.name) {
          // 更新该课程
          let course = courses[0];
          course.name = ctx.request.body.course.name;
          course.classroom = ctx.request.body.course.classroom;
          course.time = ctx.request.body.course.time;
          await course.save();

          ctx.body = {
            isOK: true,
            name: ctx.request.body.course.name,
            classroom: ctx.request.body.course.classroom,
            time: ctx.request.body.course.time
          };
        // 该课程存在
        } else {
          ctx.body = {
            isOK: false,
            message: '课程名已被您用过，请换为其他名称'
          }
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
