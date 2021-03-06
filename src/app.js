const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
// const co = require('co');
const json = require('koa-json')();
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger')();
const routers = require('./routes');
const errorHandler = require('./middleware/error-handler');
const jwtVerify = require('./middleware/jwt-verify');
const fetchHandler = require('./middleware/fetch-handler');
const path = require('path');

// const mysqlConnection = require('./lib/db');

/**
 * middlewares
 */
app.use(bodyparser);
app.use(json);
app.use(logger);

/**
 * koa static server for product environment
 */
const publicPath = path.join(__dirname, '../../dist');
app.use(require('koa-static')(publicPath));

/**
 * view page
 */
app.use(views(`${__dirname}/views`, {
    extension: 'jade'
}));

// Add mysqlConnection object into the context
// app.context.db = mysqlConnection;

/**
 * 应用异常处理
 */
app.use(errorHandler);

/**
 * jwt 认证
 */
app.use(jwtVerify);

/**
 * fetch 封装
 */
app.use(fetchHandler);

/**
 * register router
 */
app.use(routers.routes(), router.allowedMethods());

app.on('error', (err) => {
    // const context = ctx;
    console.log('App on error => \n', err);
    // ctx.body = err;
    // logger.error('server error', err, ctx);
});


module.exports = app;
