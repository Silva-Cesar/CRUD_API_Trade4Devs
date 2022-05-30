import { NextFunction, Request, Response } from 'express';
import Balance from '../schemas/Balance';
import Controller from './Controller';

class BalanceController extends Controller {
  constructor() {
    super('/balance');
  }

  protected initRoutes(): void {
    this.router.get(`${this.path}/all`, this.listAll);
    this.router.post(this.path, this.create);
    this.router.get(this.path, this.findByCPF);
    this.router.patch(this.path, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Retorna o saldo de todos os usuários.
  private async listAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const balance = await Balance.find();
  
    return res.status(200).send(balance);
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Cria um documento com o nome, CPF e o saldo do usuário.
  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    
    try {
      const balance = await Balance.create(req.body);

      return res.status(200).send(balance);

    } catch (error) {
      return res.status(400).send(error);
    }
  }

  // FUNÇÃO PRINCIPAL DA API BALANCE
  // Função para retornar o saldo com o nome do usuário, data e hora da solicitação.
  private async findByCPF(req: Request, res: Response, next: NextFunction): Promise<Response> {

    const { cpf } = req.body; // Coleta o CPF que foi digitado na requisição.

    try {
    
    if (!cpf) return res.status(400).send('Informe seu CPF!'); // Se o CPF não for informado, retorna uma mensagem de erro.

    const balance = await Balance.find({ cpf }); // Busca o documento onde tem aquele CPF

    const date = new Date();

    return res.status(200).send({ // Retorna as informações dentro de um objeto para ser utilizado pelo front.
      name: balance[0].name,
      balance: balance[0].balance,
      date: date
    });

    } catch (error) {
      return res.status(400).send('CPF inválido!'); // Se o CPF não constar na base de dados, retorna erro.
    }
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Pode ser utilizada para uma possível atualização e incremento de API de depósito e saque.
  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { cpf, value } = req.body;

    // Busca o CPF na base de dados de Balance e atualiza o campo saldo.
    const updateBalance = await Balance.findOneAndUpdate({ cpf: cpf }, { $inc: {balance: value}});

    const newBalance = await Balance.find({ cpf });

    return res.send(newBalance);
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Criada para deletar testes durante desenvolvimento.
  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    await Balance.deleteOne({ id });
    return res.status(204).send('Deleted.');
  }
}

export default BalanceController;
