import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as bcrypt from 'bcrypt';
import User from '../models/userModel';
import userRouter from '../routes/userRoutes';

let app: Express;
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  mongoose.connect(uri)

  app = express();
  app.use(express.json());
  app.use('/users', userRouter);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('User Routes', () => {
  test('POST /users/register - Register a new user', async () => {
    const testUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/users/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('username', testUser.username);
    expect(response.body).toHaveProperty('accessToken');
  });

  test('POST /users/login - Login with valid credentials', async () => {
    const testUser = {
      username: 'anotheruser',
      password: 'testpassword',
    };

    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await User.create({
      username: testUser.username,
      password: hashedPassword,
    });

    const response = await request(app)
      .post('/users/login')
      .send(testUser)
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
  });

  test('POST /users/login - Login with invalid credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ username: 'nonexistent', password: 'invalidpassword' })
      .expect(401);

    expect(response.body).toHaveProperty('message', 'Username or password are invalid');
  });

});