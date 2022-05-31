import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { Constants } from '../Constants'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const jwtSecret = Constants.JWT_SECRET;
    const token = req.headers.authorization;

    if(!token){
      return res.status(401).send({error: "Invalid token"})
    }

    try {
      jwt.verify(token, jwtSecret)
      next()
    } catch (error) {
      return res.status(401).send({error: error.message})
    }
  }
  export { authMiddleware }