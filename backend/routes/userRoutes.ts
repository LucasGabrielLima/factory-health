import { Router } from 'express';
import User from '../models/userModel'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const userRouter = Router();

userRouter.post('/register', async (req, res) => {
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
        { expiresIn: process.env.TOKEN_EXPIRE_TIME });
      return res.status(201).json({ _id: user.id, username: user.username, accessToken })
    }
    else {
      return res.status(400).json({ message: 'User data is not valid' })
  
    }
  });
  
  userRouter.post('/login', async (req, res) => {
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
        { expiresIn: process.env.TOKEN_EXPIRE_TIME });
  
  
      return res.status(200).json({ accessToken });
    }
    else {
      return res.status(401).json({ message: 'Username or password are invalid' })
    }
  });

export default userRouter