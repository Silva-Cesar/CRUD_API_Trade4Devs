import { NextFunction, Request, Response } from 'express';
import Balance from '../schemas/Balance';
import Controller from './Controller';

class BalanceController extends Controller {
  constructor() {
    super('/balance');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.post(this.path, this.create);
    this.router.get(this.path, this.findById);
    this.router.put(this.path, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const balance = await Balance.find();
    return res.send(balance);
    // return res.send('Saldo dos usuários'); - No projeto final usar esse return
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const balance = await Balance.create(req.body);

    return res.send(balance);
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const bodyReq = req.body;

    const { id } = req.params;

    if (!bodyReq.cpf) {
      return res.status(400).send('Invalid user Id');
    }

    const balance = await Balance.findById(id);

    if (!balance) {
      return res.status(404).send('Balance field does not exist for this account.');
    }

    return res.send(balance);
  }

  // Remover edit caso essa função seja executada pela operação
  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    await Balance.findByIdAndUpdate(id, req.body);
    const balance = await Balance.findById(id);
    return res.send(balance);
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    // const balance = await Balance.findById(id);
    // balance?.deleteOne();

    await Balance.deleteOne({ id });
    return res.status(204);
  }
}

export default BalanceController;
