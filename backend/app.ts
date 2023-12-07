import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import cors from 'cors'
import { getMachineHealth } from './machineHealth';
import User from './models/userModel'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import validateToken from './middleware/validateTokenHandler';

dotenv.config();

mongoose.connect("mongodb://localhost:27017/factory-health")

const app = express();
const port = process.env.APPLICATION_PORT;

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST']
}))

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to get machine health score
app.post('/machine-health', validateToken, (req: Request, res: Response) => {
  const result = getMachineHealth(req);
  if (result.error) {
    return res.status(400).json(result);
  } else {
    return res.json(result);
  }
});

app.post('/user/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' })
  }

  const usernameExists = await User.findOne({ username })
  if (usernameExists) {
    return res.status(400).json({ message: 'Username already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    password: hashedPassword
  })

  if (user) {
    const accessToken = jwt.sign({
      user: {
        username: user.username,
        id: user.id
      }
    },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1m' });
    return res.status(201).json({ _id: user.id, username: user.username, accessToken })
  }
  else {
    return res.status(400).json({ message: 'User data is not valid' })

  }
});

app.post('/user/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' })
  }

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign({
      user: {
        username: user.username,
        id: user.id
      }
    },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1m' });


    return res.status(200).json({ accessToken });
  }
  else {
    return res.status(401).json({ message: 'Username or password are invalid' })
  }
});

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
