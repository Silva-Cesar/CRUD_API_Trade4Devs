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
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  // Função para retornar todos os registros escondendo e-mail e password.
  private async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const register = await Register.find().select({ email: 0, password: 0, __v: 0 });
    return res.send(register);
  }

  // FUNÇÃO PRINCIPAL DA API DE REGISTRO
  // Função para criar um registro de usuário.
  // Ao ser criado o registro do usuário, é criado um documento na API de Saldo
  // com o CPF do usuário e o saldo com valor zero.
  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const register = await Register.create(req.body);

    const balance = await Balance.create({ ...req.body, saldo: 0 });

    return res.send('Conta criada com sucesso!');
  }

  // Função para deletar registro de usuário.
  // Ao deletar o registro de usuário o Saldo com o mesmo CPF é excluído.
  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    const register = await Register.findById(id);
    register.deleteOne();

    const balance = await Balance.deleteOne({cpf: register.cpf});
    
    return res.send(`${register} ${balance}`);
  }
}

export default RegisterController;
