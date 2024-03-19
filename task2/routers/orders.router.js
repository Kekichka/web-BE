import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares.js';
import { ADDRESSES, ORDERS } from '../db.js';

export const OrdersRouter = Router();



const convertToDate = (date) => {

 /***
  * ^ -- початок рядка
  * \d -- перевірка на цифру
  * {N} -- N - разів повторень
  */
 // if (/^\d\d-(01|02|03|....|10|11|12)-\d{4}$/.test(query.createdAt)) { }
 if (!/^\d\d-\d\d-\d{4}$/.test(date)) {
  // return res.status(400).send({ message: `parameter createdAt has wrong format` });
  throw new Error(`parameter createdAt has wrong format`);
 }

 // const res = query.createdAt.split('-');
 // const month = res[1];
 const [day, month, year] = date.split('-');

 const mothsInt = parseInt(month);
 if (mothsInt < 1 || mothsInt > 12) {
  // return res.status(400).send({ message: `parameter createdAt has wrong month value` });

  throw new Error(`parameter createdAt has wrong month value`);
 }

 const result = new Date();
 result.setHours(2);
 result.setMinutes(0);
 result.setMilliseconds(0);
 result.setSeconds(0);

 result.setMonth(mothsInt - 1);
 result.setDate(day);
 result.setFullYear(year);

 return result;
};

const convertToDateMiddleware = (fieldName) => (req, res, next) => {
 const valueString = req.query[fieldName];

 if (!valueString) {
  return next();
 }
 try {
  const value = convertToDate(valueString);
  req.query[fieldName] = value;
  return next();
 } catch (err) {
  return res.status(400)
   .send({ message: err.toString() });
 }
};


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const distance = Math.abs(lat1 - lat2) + Math.abs(lon1 - lon2); 
  return distance;
}

OrdersRouter.post('/orders', authorizationMiddleware, (req, res) => {
  const { body, user } = req;

  const createdAt = new Date();
  createdAt.setHours(2);
  createdAt.setMinutes(0);
  createdAt.setMilliseconds(0);
  createdAt.setSeconds(0);

  const fromAddress = ADDRESSES.find(address => address.name === body.from);
  const toAddress = ADDRESSES.find(address => address.name === body.to);

  if (!fromAddress || !toAddress) {
      return res.status(400).send({ message: 'The addresses are not valid.' });
  }

  if (!user) {
      return res.status(400).send({ message: 'User is not found' });
  }

  if (user.role !== 'Customer') {
    return res.status(403).send({ message: 'User does not have permission to create orders' });
  }

  const distance = calculateDistance(fromAddress.location.latitude, fromAddress.location.longitude, toAddress.location.latitude, toAddress.location.longitude);

  let price;
  switch (body.type) {
      case "standard":
          price = distance * 2.5;
          break;
      case "lite":
          price = distance * 1.5;
          break;
      case "universal":
          price = distance * 3;
          break;
      default:
          return res.status(400).send({ message: 'Order type is wrong' });
  }

  const order = {
      ...body,
      login: user.login,
      createdAt,
      distance: distance + " km",
      price: "$" + price.toFixed(2),
      status: "Active",
      id: crypto.randomUUID(),
  };

  ORDERS.push(order);

  return res.status(200).send({ message: 'Your order was created', order });
});

/**
* GET /orders?createdAt=05-05-2024
* GET /orders?createdAt= g mhdfbg kjdfbgkjd
*/
OrdersRouter.get('/orders', authorizationMiddleware,
 convertToDateMiddleware('createdAt'),
 convertToDateMiddleware('createdFrom'),
 convertToDateMiddleware('createdTo'),
 (req, res) => {
  const { user, query } = req;

  if (query.createdAt && query.createdFrom && query.createdTo) {
   return res.status(400).send({ message: "Too many parameter in query string" });
  }

  console.log(`query`, JSON.stringify(query));

  let orders = ORDERS.filter(el => el.login === user.login);


  if (user.role === 'Driver') {
    orders = ORDERS.filter(el => el.status === 'Active');

  } else if (user.role === 'Admin') {
    orders = ORDERS;

  } else {
    orders = ORDERS.filter(el => el.login === user.login);
  }

  if (query.createdAt) {

   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() === query.createdAt.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  if (query.createdFrom) {
   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() >= query.createdFrom.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  if (query.createdTo) {
   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() <= query.createdTo.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }
  

  return res.status(200).send(orders);
 });

  

/**
 * PATCH /orders/fhsdjkhfkdsj
 * PATCH /orders/fhsdjkhfkdsj12
 * PATCH /orders/fhsdjkhfkdsj123
 * PATCH /orders/fhsdjkhfkd123sj
 */

OrdersRouter.patch('/orders/:orderId', (req, res) => {
  const { params, body, user } = req;

  let order = ORDERS.find(el => el.id === params.orderId);

 ORDERS.update((el) => el.id === params.orderId, { status: order.status });

  if (!order) {
    return res.status(404).send({ message: `Order with id ${params.orderId} was not found` });
  }

  if (user && user.role === 'Customer' && order.status === 'Active') {
  
    order.status = 'Rejected';

    return res.status(200).send(order);
  }

  return res.status(400).send({ message: `Order status cannot be changed` });
});
