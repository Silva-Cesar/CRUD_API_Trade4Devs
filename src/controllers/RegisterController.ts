import { NextFunction, Request, Response } from 'express';
import Register from '../schemas/Register';
import Controller from './Controller';
import Balance from '../schemas/Balance';

class RegisterController extends Controller {
  constructor() {
    super('/register');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.create);
    // this.router.get(`${this.path}/:id`, this.findById);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const register = await Register.find();
    return res.send(register);
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const register = await Register.create(req.body);

    const balance = await Balance.create({...req.body, saldo: 0});

    return res.send(register)
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const register = await Register.findById(id);
    register.deleteOne();
    return res.send(register);
  }
}

export default RegisterController;
