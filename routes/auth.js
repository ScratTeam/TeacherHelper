// 申明依赖
const Router = require('koa-router');

module.exports = function(app) {
  // 创建 router
  var router = new Router({prefix: '/auth'});

  // 对请求进行响应
  router.get('/', async function(ctx, next) {});

  // 在 app 中打入 routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return router;
}
