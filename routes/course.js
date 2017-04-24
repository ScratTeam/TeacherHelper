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
  var router = new Router({prefix: '/course'});

  router.post('/update-course', async function(ctx, next) {
    console.log('course updating(?)');
    // TODO 更新课程信息
    // 在实现新增功能之前测试用的
    let course = new Course({
        name: ctx.req.body.course.name,
        classroom: ctx.req.body.course.classroom,
        time: ctx.req.body.course.time
      });
    courses = await Course.find({ name: ctx.req.body.oldName });
    if(courses.length == 0) {
      await course.save();
      ctx.body = { isOk: true,
        name: ctx.req.body.course.name,
        classroom: ctx.req.body.course.classroom,
        time: ctx.req.body.course.time
      };
    } else if(courses.length == 1) {
      var conditions = { _id: courses[0]._id };
      var update = { $set: {
        classroom: ctx.req.body.course.classroom,
        time: ctx.req.body.course.time
      } };
      var options = { upsert: true};
      Course.update(conditions, update, options, function(error) {
        if(error) {
          console.log(error);
        } else {
          console.log('course updated');
        }
      });
      ctx.body = { isOk: true,
        name: ctx.req.body.course.name,
        classroom: ctx.req.body.course.classroom,
        time: ctx.req.body.course.time
      };
    } else {
      console.log('something error');
    }
  });

  router.post('add-course', async function(ctx, next) {
    // TODO 增加课程
  });

  return router;
}
