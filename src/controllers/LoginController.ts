import { NextFunction, Request, Response } from 'express';
import Register from '../schemas/Register';
import Controller from './Controller';

class LoginController extends Controller {
  constructor() {
    super('/login');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.getLogin);
  }

  // FUNÇÃO PRINCIPAL DA API DE LOGIN
  // Função para varrer a base de dados de Registro e buscar por um registro que contenha o
  // CPF e o Password solicitado na requisição.
  private async getLogin(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const login = await Register.find({
      cpf: req.body.cpf,
      password: req.body.password,
    });

    if (!login.length) {
      return res.status(401).send('CPF e/ou Senha incorreto(s).');
    }

    return res.send('Login efetuado com sucesso!');
  }
}

export default LoginController;
