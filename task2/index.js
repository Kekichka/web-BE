import express from 'express';
import bodyParser from 'body-parser';
import UsersRouter from './routers/users.router.js';

const app = express();

app.use(bodyParser.json());

app.use(UsersRouter);

app.listen(8080, () => console.log('Server was started'));

