import express from 'express';
import bodyParser from 'body-parser';
import UsersRouter from './routers/users.router.js';
import {OrdersRouter} from './routers/orders.router.js';

const app = express();

app.use(bodyParser.json());

app.use(UsersRouter);
app.use(OrdersRouter);

app.listen(8080, () => console.log('Server was started'));

