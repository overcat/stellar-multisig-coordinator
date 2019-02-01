const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require('koa-bodyparser');
const Logger = require('koa-logger');
const email = require('../config').email;
const AppError = require('./errors');


const app = new Koa();
const router = new Router();


const PORT = 3000;

if (process.env.NODE_ENV === 'development') {
    app.use(Logger());
}

const errorHandler = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.response.status = err.status || 500;
        ctx.response.body = {
            error: err.message || `Unknown error, please contact ${email} to get support.`,
            code: err.code || "unknown"
        }
    }
};
app.use(errorHandler);

app.use(async (ctx, next) => {
    if (ctx.req.method === 'POST' && ctx.req.headers['content-type'] !== 'application/x-www-form-urlencoded') {
        ctx.throw(new AppError(415, 'unsupported_media_type', 'The request has an unsupported content type. Presently, the only supported content type is application/x-www-form-urlencoded.'));
    }
    await next();
});

app.use(bodyParser({
    enableTypes: ['form'],
    formLimit: '32kb',
    strict: true,
    onerror: (err, ctx) => {
        console.log(hello);
        ctx.throw(422, "body parse error")
    }
}));


require('./routes')(router);
app.use(router.routes())
    .use(router.allowedMethods());


const server = app.listen(PORT, () => {
    console.log(`[${process.env.NODE_ENV}] Server listening on: http://localhost:${PORT}`);
});

module.exports = server;