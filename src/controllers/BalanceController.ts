import { NextFunction, Request, Response } from 'express';
import Balance from '../schemas/Balance';
import { authMiddleware } from '../utils/middlewares/authMiddleware';
import Controller from './Controller';
import jwt from 'jsonwebtoken';


class BalanceController extends Controller {
  constructor() {
    super('/balance');
  }

  protected initRoutes(): void {
    this.router.get(`${this.path}/all`, authMiddleware, this.list);
    // this.router.post(this.path, authMiddleware, this.create); // Faz sentido criar um outro saldo para o usuário?
    this.router.get(this.path, authMiddleware, this.findByCPF);
    this.router.put(this.path, authMiddleware, this.edit); // Faz sentido um usuário alterar seu próprio saldo?
    this.router.delete(`${this.path}/:id`, authMiddleware, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const balance = await Balance.find();
    return res.send(balance);
    // return res.send('Saldo dos usuários'); - No projeto final usar esse return
  }

  // private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const balance = await Balance.create(req.body);

  //   return res.send(balance);
  // }

  // Função principal do Balance
  // Função para retornar o saldo com o nome do usuário, data e hora do pedido.
  private async findByCPF(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const token = req.headers.authorization!
    const { data }: any = jwt.decode(token)
    const cpf = data.cpf

    try {
    
    if (!cpf) return res.status(400).send('Informe seu CPF!'); // Se o CPF não for informado, retorna uma mensagem de erro.

    const balance = await Balance.find({ cpf });
    const date = new Date();
    const responseData = {
      userName: balance[0].name,
      balance: balance[0].balance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
      date: date.toLocaleString()
    }

    return res.send(responseData)

    // return res.send(`
    // ${balance[0].name}
    // Saldo: ${balance[0].saldo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}

    // ${date.toLocaleString()}`);

    } catch (error) {
      return res.status(400).send('CPF inválido!'); // Se o CPF não constar na base de dados, retorna erro.
    }
  }

  // Remover edit caso essa função seja executada pela operação
  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { cpf, value } = req.body;
    const updateBalance = await Balance.findOneAndUpdate({ cpf: cpf }, { $inc: {balance: value}});

    const newBalance = await Balance.find({ cpf }); // Faz sentido buscar o usuário novamente no banco de dados? 

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
