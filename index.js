const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const { faker } = require('@faker-js/faker');

const app = new Koa();
const router = new Router();

app.use((ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    next();
    return;
  }
  
  ctx.response.set('Access-Control-Allow-Headers', 'x-requested-with');
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Access-Control-Allow-Methods', 'GET');
  ctx.response.status = 204;
});

router.get('/messages/unread', (ctx) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');

  const id = faker.string.uuid();
  const userName = faker.person.firstName();
  const email = faker.internet.email({ firstName: userName });
  const message = faker.lorem.sentences();
  const date = Date.now();

  const mess = {
    "status": "ok",
    "timestamp": date,
    "messages": [
      {
        "id": id,
        "from": email,
        "subject": "Hello from " + userName,
        "body": message,
        "received": date
      }
    ]
  }

  ctx.response.status = 200;
  ctx.response.body = JSON.stringify(mess);
});

app.use(router.routes()).use(router.allowedMethods());

const server = http.createServer(app.callback());

const port = process.env.PORT || 3001;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log('Server is listen: ' + port);
});