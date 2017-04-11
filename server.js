// 申明依赖
const Koa = require('koa');
const send = require('koa-send');

// 创建 app
var app = new Koa();

// 配置静态文件
app.use(require('koa-static')(`${__dirname}/dist`));

// 引入路径
require('./routes/auth')(app);

// 将对 SPA 的直接访问重新导回 Angular 的路由
app.use(async (ctx) => {
  await send(ctx, '/dist/index.html');
});

// 监听
var port = 3000;
app.listen(port);
console.log('listening on port', port);
