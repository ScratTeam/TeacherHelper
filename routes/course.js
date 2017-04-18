// 申明依赖
const Router = require('koa-router');
const mongoose = require('mongoose');

// 定义凭证
const courseSchema = new mongoose.Schema({
  name: String,
  classrome: String,
  time: String
});
const Course = mongoose.model('Course', courseSchema);
