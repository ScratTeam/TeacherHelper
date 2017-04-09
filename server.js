// 申明依赖
const Koa = require('koa');

// 创建 app
var app = new Koa();

// 配置静态文件
app.use(require('koa-static')(`${__dirname}/dist`));

// 引入路径
require('./routes/auth')(app);

// 监听
var port = 3000;
app.listen(port);
console.log('listening on port', port);
