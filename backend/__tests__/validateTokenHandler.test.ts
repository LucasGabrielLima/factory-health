import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import validateToken from '../middleware/validateTokenHandler';
import * as jwt from 'jsonwebtoken';


let app: Express;
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  mongoose.connect(uri)

  app = express();
  app.use(express.json());
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('validateToken Middleware', () => {
  const mockRequest = (token?: string) => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  test('Should pass with a valid token', async () => {
    const validToken = jwt.sign({ user: { username: 'testuser', id: '123' } }, process.env.ACCESS_TOKEN_SECRET as string);
    
    app.get('/protected-route', validateToken, (req, res) => {
      res.status(200).json({ message: 'Access granted!' });
    });

    const response = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body).toEqual({ message: 'Access granted!' });
  });

  test('Should fail with an invalid token', async () => {
    const invalidToken = 'invalid_token';

    app.get('/protected-route', validateToken, (req, res) => {
      res.status(200).json({ message: 'Access granted!' });
    });

    const response = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);

    expect(response.body).toEqual({ message: 'User is not authorized or token expired' });
  });

  test('Should fail with missing token', async () => {

    app.get('/protected-route', validateToken, (req, res) => {
      res.status(200).json({ message: 'Access granted!' });
    });

    const response = await request(app)
      .get('/protected-route')
      .expect(401);

    expect(response.body).toEqual({ message: 'User is not authorized or bearer token is missing' });
  });
});