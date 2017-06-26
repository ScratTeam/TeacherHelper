// 申明依赖
const Koa = require('koa');
const send = require('koa-send');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const mongoose = require('mongoose');

// 设置数据库
const databaseUrl = 'mongodb://localhost:27017/scrat';
mongoose.connect(databaseUrl);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // 创建 app
  let app = new Koa();

  // 静态文件
  app.use(require('koa-static')(`${__dirname}/dist`));

  // body parser
  app.use(bodyParser());

  // json
  app.use(json());

  // sessions
  app.keys = ['liuren shuqian wangzi'];
  app.use(session({ key: 'scrat:sess' }, app));

  // 共享数据
  let shareData = {};

  // 引入路径
  require('./routes/auth')(app, shareData);
  require('./routes/user')(app, shareData);
  require('./routes/course')(app, shareData);
  require('./routes/test')(app, shareData);
  require('./routes/check-in')(app, shareData);

  // 将对 SPA 的直接访问重新导回 Angular 的路由
  app.use(async (ctx) => {
    await send(ctx, '/dist/index.html');
  });

  // 监听
  let port = 3000;
  app.listen(port);
  console.log('listening on port', port);
});
