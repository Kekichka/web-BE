import express from 'express';
import bodyParser from 'body-parser';
import { USERS, ORDERS } from './db.js';
import { authorizationMiddleware } from './middlewares.js';

const app = express();

app.use(bodyParser.json());

/**
 * POST -- create resource
 * req -> input data
 * res -> output data
 */
app.post('/users', (req, res) => {
 const { body } = req;

 console.log(`body`, JSON.stringify(body));

 const isUserExist = USERS.some(el => el.login === body.login);
 if (isUserExist) {
  return res.status(400).send({ message: `user with login ${body.login} already exists` });
 }

 USERS.push(body);

 res.status(200).send({ message: 'User was created' });
});

app.get('/users', (req, res) => {
 const users = USERS.map(user => {
  const { password, ...other } = user;
  return other;
 });
 return res
  .status(200)
  .send(users);
});

app.post('/login', (req, res) => {
 const { body } = req;

 const user = USERS
  .find(el => el.login === body.login && el.password === body.password);

 if (!user) {
  return res.status(400).send({ message: 'User was not found' });
 }

 const token = crypto.randomUUID();

 user.token = token;
 USERS.save(user.login, { token });

 return res.status(200).send({
  token,
  message: 'User was login'
 });
});

app.post('/orders', authorizationMiddleware, (req, res) => {
 const { body, user } = req;
 const min = 20;
 const max = 100;

const orderprice = Math. floor(Math. random() * ((max-min)+1) + min) + '₴' 

 const order = {
  ...body,
  login: user.login,
  price: orderprice
 };

 ORDERS.push(order);

 return res.status(200).send({ message: 'Order was created', order });
});

app.get('/orders', authorizationMiddleware, (req, res) => {
 const { user } = req;

 const orders = ORDERS.filter(el => el.login === user.login);

 return res.status(200).send(orders);
});

app.listen(8080, () => console.log('Server was started'));

app.get('/address/from/last-5', authorizationMiddleware, (req, res) => {
  const { user } = req;
 
  const orders = ORDERS.filter(el => el.login === user.login);

  const addresses = [...new Set (orders.map(el => el.from))];

  const last5addressesfrom = addresses.slice(-5)

  return res.status(200).json(last5addressesfrom)
 });

app.get('/address/to/last-3', authorizationMiddleware, (req, res) => {
  const { user } = req;
 
  const orders = ORDERS.filter(el => el.login === user.login);

  const addresses = [...new Set (orders.map(el => el.to))];

  const last3addressesto = addresses.slice(-3)

  return res.status(200).json(last3addressesto)
 });

app.get('/orders/lowest', authorizationMiddleware, (req, res) => {
  const { user } = req;
 
  const orders = ORDERS.filter(el => el.login === user.login);

  const lowestprice = orders.reduce((lowest, order) => {return order.price < lowest.price ? order: lowest; }, orders[0])

  return res.status(200).send(lowestprice)
 });

 app.get('/orders/biggest', authorizationMiddleware, (req, res) => {
  const { user } = req;
 
  const orders = ORDERS.filter(el => el.login === user.login);

  const biggestprice = orders.reduce((biggest, order) => {return order.price > biggest.price ? order: biggest; }, orders[0])

  return res.status(200).send(biggestprice)
 });

