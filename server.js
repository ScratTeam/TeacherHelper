// 申明依赖
const Koa = require('koa');

// 创建 app
var app = new Koa();

// 引入路径
require('./routes/auth')(app);

// 监听
var port = 3000;
app.listen(port);
console.log('listening on port', port);
