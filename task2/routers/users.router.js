import {Router} from 'express';
import { USERS } from '../db.js';


const UserRouter = Router()

UserRouter.post('/users', (req, res) => {
    const { body } = req;
  
    console.log(`body`, JSON.stringify(body));
  
    const isUserExist = USERS.some(el => el.login === body.login);
    if (isUserExist) {
      return res.status(400).send({ message: `user with login ${body.login} already exists` });
    }

  const user = {
    ...body,
    role: "Customer"
  };
  
    USERS.push(user);
  
    res.status(200).send({ message: 'User  was created' });
  });
  
  UserRouter.get('/users', (req, res) => {
    const users = USERS.map(user => {
      const { password, ...other } = user;
      return other;
    });
    return res
      .status(200)
      .send(users);
  });
  
  UserRouter.post('/admin', (req, res) => {
    const { body, headers } = req;
    const { authorization } = headers;
    const { login, password } = body;

    if (authorization !== 'meowmeow77') {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const isUserExist = USERS.some(el => el.login === login);
    if (isUserExist) {
        return res.status(400).send({ message: `User with login ${login} already exists` });
    }

    const adminUser = {
        login,
        password,
        role: 'Admin'
    };

    USERS.push(adminUser);

    return res.status(200).send({ message: 'Admin user was created' });
});

UserRouter.post('/driver', (req, res) => {
  const { body } = req;
  const { login, password } = body

  const isUserExist = USERS.some(el => el.login === login);
  if (isUserExist) {
      return res.status(400).send({ message: `User with login ${login} already exists` });
  }

  const driverUser = {
      login,
      password,
      role: 'Driver'
  };

  USERS.push(driverUser);

  return res.status(200).send({ message: 'Driver user was created' });
});

  UserRouter.post('/login', (req, res) => {
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
  
  export default UserRouter;
