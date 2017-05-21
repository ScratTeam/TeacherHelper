// 申明依赖
const Koa = require('koa');
const http = require('http');
const https = require('https');
const fs = require('fs');
const forceSSL = require('koa-force-ssl');
const send = require('koa-send');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const mongoose = require('mongoose');

// 设置数据库
const databaseUrl = 'mongodb://localhost:27017/scrat';
mongoose.connect(databaseUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // 创建 app
  var app = new Koa();

  // 强制所有页面使用 SSL
  app.use(forceSSL());

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
  var shareData = {};

  // 引入路径
  require('./routes/auth')(app, shareData);
  require('./routes/user')(app, shareData);
  require('./routes/course')(app, shareData);
  require('./routes/test')(app, shareData);

  // 将对 SPA 的直接访问重新导回 Angular 的路由
  app.use(async (ctx) => {
    await send(ctx, '/dist/index.html');
  });

  // SSL 配置
  var options = {
    key: fs.readFileSync('ssl/privkey.pem'),
    cert: fs.readFileSync('ssl/fullchain.pem')
  }

  // 监听
  http.createServer(app.callback()).listen(80);
  https.createServer(options, app.callback()).listen(443);
  console.log('server starts successfully!');
});
