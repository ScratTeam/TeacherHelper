// 申明依赖
const Router = require('koa-router');

module.exports = function(app) {
  // 创建 router
  var router = new Router({prefix: '/auth'});

  router.get('/', function(ctx, next) {
    ctx.body = 'Hello!';
  });

  // 在 app 中打入 routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return router;
}
