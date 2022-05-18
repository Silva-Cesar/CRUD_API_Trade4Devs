import { NextFunction, Request, Response } from 'express';
import User from '../schemas/User';
import Controller from './Controller';
import { Types } from 'mongoose';

class UserController extends Controller {
  constructor() {
    super('/user');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.post(this.path, this.create);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const users = await User.find();
    return res.send(users);
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const users = await User.insertMany(req.body);

    return res.send(users)
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).send('Id Inválido');
    }

    const users = await User.findById(id);

    if(!users) {
      return res.status(400).send('Usuário não encontrado');
    }

    return res.send(users);
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, req.body);
    const users = await User.findById(id);
    return res.send(users);
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const users = await User.findById(id);
    users.deleteOne();
    return res.send(users);
  }
}

export default UserController;
