import { NextFunction, Request, Response } from 'express';
import Statement from '../schemas/Statement';
import Controller from './Controller';
import { Types } from 'mongoose';

class StatementController extends Controller {
  constructor() {
    super('/statement');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list); // recebe mes e cpf (e ano) - quem chama é o front
    this.router.get(`${this.path}/all`, this.listAll); // recebe mes e cpf (e ano) - quem chama é o front
    this.router.post(this.path, this.create); // recebe APENAS o id da operação
    this.router.get(`${this.path}/:cpf`, this.findByCPF);
    //this.router.get(`${this.path}/:id`, this.findById);
    //this.router.put(`${this.path}/:id`, this.edit);
    //this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const statements = await Statement.find();

    if (statements.length > 0) {
      return res.send(statements);
    } else {
      return res.status(400).send('Nenhum extrato encontrado');
    }

  }

  private async listAll(req: Request, res: Response, next: NextFunction): Promise<Response> {

    return res.send(await Statement.find().populate('operations'));

  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {



    // verificar se os ids que vierem em " operations " sao do tipo Operation mesmo!!!

    return res.send(await Statement.updateOne(
      {
        month: req.body.month,
        year: req.body.year,
        cpf: req.body.cpf,
      },
      {
        $addToSet: { operations: { $each: req.body.operations } },
      },
      {
        upsert: true,
        runValidators: true
      }

    ));

  }

  private async findByCPF(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { cpf } = req.params;

    //    if (!Types.ObjectId.isValid(id)) {
    //      return res.status(400).send('Id Inválido');
    //    }

    const statement = await Statement.find({ 'cpf': cpf });

    if (statement.length > 0) {
      return res.send(statement);
    } else {
      return res.status(400).send('Extrato não encontrado');
    }


  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).send('Id Inválido');
    }

    const statement = await Statement.findById(id);

    if (!statement) {
      return res.status(400).send('Produto não encontrado');
    }

    return res.send(statement);
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    await Statement.findByIdAndUpdate(id, req.body);
    const statement = await Statement.findById(id);
    return res.send(statement);
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const statement = await Statement.findById(id);
    statement.deleteOne();
    return res.send(statement);
  }
}

export default StatementController;
