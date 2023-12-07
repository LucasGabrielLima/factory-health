import asyncHandler from 'express-async-handler';
import * as jwt from 'jsonwebtoken';

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader: string = (req.headers.Authorization! || req.headers.authorization) as string;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, _decoded) => {
            if (err) {
                return res.status(401).json({message: 'User is not authorized'});
            }
        })

        return next();
    }

    if (!token) {
        res.status(401).json({message: 'User is not authorized or bearer token is missing'});
    }
})

export default validateToken;