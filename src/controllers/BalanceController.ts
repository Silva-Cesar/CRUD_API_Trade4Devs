import { NextFunction, Request, Response } from 'express';
import Balance from '../schemas/Balance';
import Controller from './Controller';

class BalanceController extends Controller {
  constructor() {
    super('/balance');
  }

  protected initRoutes(): void {
    this.router.get(`${this.path}/all`, this.list);
    this.router.post(this.path, this.create);
    this.router.get(this.path, this.findByCPF);
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

  // Função principal do Balance
  // Função para retornar o saldo com o nome do usuário, data e hora do pedido.
  private async findByCPF(req: Request, res: Response, next: NextFunction): Promise<Response> {

    const { cpf } = req.body;

    try {
    
    if (!cpf) return res.status(400).send('Informe seu CPF!'); // Se o CPF não for informado, retorna uma mensagem de erro.

    const balance = await Balance.find({ cpf });

    const date = new Date();

    return res.send(`
    ${balance[0].name}
    Saldo: ${balance[0].saldo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}

    ${date.toLocaleString()}`);

    } catch (error) {
      return res.status(400).send('CPF inválido!'); // Se o CPF não constar na base de dados, retorna erro.
    }
  }

  // Remover edit caso essa função seja executada pela operação
  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { cpf, value } = req.body;
    const updateBalance = await Balance.findOneAndUpdate({ cpf: cpf }, { $inc: {saldo: value}});

    const newBalance = await Balance.find({ cpf });

    return res.send(newBalance);
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
