import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const jwtToken = process.env.JWT_TOKEN || 'my_super_secret';
    const token = req.headers.authorization;

    if(!token){
      return res.status(401).send({error: "Invalid token"})
    }

    try {
      jwt.verify(token, jwtToken)
      next()
    } catch (error) {
      return res.status(401).send({error: error.message})
    }
  }

  export { authMiddleware }