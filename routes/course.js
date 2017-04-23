// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
const courseSchema = new mongoose.Schema({
  name: String,
  classroom: String,
  time: String
});
const Course = mongoose.model('Course', courseSchema);

module.exports = function(app, shareData) {
  // 创建 router
  var router = new Router({prefix: '/course'});

  router.post('/update-course', async function(ctx, next) {
    console.log('course updating(?)');
    // TODO 更新课程信息
    var reqCourse = ctx.req.body.course;
    // 在实现新增功能之前测试用的
    let course = new Course({
        name: reqCourse.name,
        classroom: reqCourse.classroom,
        time: reqCourse.time
      });
    courses = await Course.find({ name: ctx.req.body.oldName });
    if(courses.length == 0) {
      await course.save();
      ctx.body = { isOk: true,
        name: reqCourse.name,
        classroom: reqCourse.classroom,
        time: reqCourse.time
      };
    } else if(courses.length == 1) {
      var conditions = { _id: courses[0]._id };
      var update = { $set: {
        classroom: reqCourse.classroom,
        time: reqCourse.time
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
        name: reqCourse.name,
        classroom: reqCourse.classroom,
        time: reqCourse.time
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
