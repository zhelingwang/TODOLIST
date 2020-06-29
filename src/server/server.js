const router = require('./route.js');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const KoaStatic = require('koa-static');
const cors = require('koa-cors');
const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(KoaStatic(__dirname));
app.use(router.routes()).use(router.allowedMethods());
app.listen(3005, () => {
    console.log("listening on port : ", 3005);
});




