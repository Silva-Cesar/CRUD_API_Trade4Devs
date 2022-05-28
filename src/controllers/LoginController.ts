import { NextFunction, Request, Response } from 'express';
import Register from '../schemas/Register';
import Controller from './Controller';
import jwt from 'jsonwebtoken';

class LoginController extends Controller {
  constructor() {
    super('/login');
  }

  protected initRoutes(): void {
    this.router.post(this.path, this.getLogin);
  }

  // FUNÇÃO PRINCIPAL DA API DE LOGIN
  // Função para varrer a base de dados de Registro e buscar por um registro que contenha o
  // CPF e o Password solicitado na requisição.
  private async getLogin(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const jwtToken: string = process.env.JWT_TOKEN || 'my_super_secret';
    const expiresIn: number = Number(process.env.JWT_EXPIRES_IN) || 60 * 10

    const { cpf, password } = req.body;
    const login = await Register.findOne({ cpf, password });

    if (!login) {
      return res.status(401).send('CPF e/ou Senha incorreto(s).');
    }

    const data = { 
      name: login.name
    }

    const token = jwt.sign({ data }, jwtToken, { expiresIn });
    const response = {accessToken: token}

    return res.status(200).send(response);
  }
}

export default LoginController;
