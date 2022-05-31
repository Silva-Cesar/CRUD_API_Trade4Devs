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
    // this.router.get(`${this.path}/all`, authMiddleware, this.listAll);
    this.router.get(this.path, authMiddleware, this.findByCPF);
    // this.router.put(this.path, authMiddleware, this.edit);
    // this.router.delete(`${this.path}/:id`, authMiddleware, this.delete);
  }

  // FUNÇÃO PRINCIPAL DA API BALANCE
  // Função para retornar o saldo com o nome do usuário, data e hora da solicitação.
  private async findByCPF(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const token = req.headers.authorization!    // Recebe o token de autorização do header.
    const { data }: any = jwt.decode(token)     // Decodifica o token e insere em data.
    const cpf = data.cpf                        // Extrai o valor da chave "cpf" e salva na variável cpf.

    try {
    
    if (!cpf) return res.status(400).send('Informe seu CPF!'); // Se o CPF não for informado, retorna uma mensagem de erro.

    const balance = await Balance.find({ cpf }); // Accesa a base de dados de Balance para encontrar o CPF.
    const date = new Date();
    const responseData = {      // Retorna Nome e Saldo o usuário com a data da solicitação.
      userName: balance[0].name,
      balance: balance[0].balance,
      date: date
    }

    return res.send(responseData)

    } catch (error) {
      return res.status(400).send('CPF inválido!'); // Se o CPF não constar na base de dados, retorna erro.
    }
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Retorna o saldo de todos os usuários.
  // private async listAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const balance = await Balance.find();
  
  //   return res.status(200).send(balance);
  // }

  

  // Função criada para testes em ambiente de desenvolvimento.
  // Pode ser utilizada para uma possível atualização e incremento de API de depósito e saque.
  // private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const { cpf, value } = req.body;

  //   if (value != Number(value).toFixed(2)) {
  //     return res.status(400).send({error: 'Valor com mais de duas casas decimais!'})
  //   };

  //   const updateBalance = await Balance.findOneAndUpdate({ cpf: cpf }, { $inc: {balance: value}});

  //   const newBalance = await Balance.find({ cpf });

  //   return res.send(newBalance);
  // }

  // Função criada para testes em ambiente de desenvolvimento.
  // Criada para deletar testes durante desenvolvimento.
  // private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const { id } = req.params;

  //   await Balance.deleteOne({ id });
  //   return res.status(204).send('Deleted.');
  // }
}

export default BalanceController;
