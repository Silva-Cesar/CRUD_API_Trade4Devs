import { NextFunction, Request, Response } from 'express';
import Register from '../schemas/Register';
import Controller from './Controller';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Constants } from '../utils/Constants';


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
    const jwtToken: string = Constants.JWT_SECRET
    const expiresIn: number = Constants.JWT_EXPIRES_IN

    const { cpf, password } = req.body;
    const login = await Register.findOne({ cpf });

    if (login) {

      if (await bcrypt.compare(password, login.password)) {
        const data = {
          cpf: login.cpf
        }

        const token = jwt.sign({ data }, jwtToken, { expiresIn });
        const response = { statusLogin: 'Sucesso', token: token }

        return res.status(200).send(response);

      }
    }
    return res.status(401).send('CPF e/ou Senha incorreto(s).');
  }
}

export default LoginController;
