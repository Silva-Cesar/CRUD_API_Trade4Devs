import { NextFunction, Request, Response } from 'express';
import Register from '../schemas/Register';
import { authMiddleware } from '../utils/middlewares/authMiddleware';
import Controller from './Controller';

class RegisterController extends Controller {
  constructor() {
    super('/register');
  }

  protected initRoutes(): void {
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.post(this.path, authMiddleware, this.create);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.delete);
  }

  // Função para retornar todos os registros escondendo e-mail e password.
  private async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const register = await Register.find().select({ email: 0, password: 0, __v: 0 });
    return res.send(register);
    // return res.send('Registro de todos os usuários'); - No projeto final usar esse return
  }

  // FUNÇÃO PRINCIPAL DA API DE REGISTRO
  // Função para criar um registro de usuário.
  // Ao ser criado o registro do usuário, é criado um documento na API de Saldo
  // com o CPF do usuário e o saldo com valor zero.
  // Se algum dado estiver faltando ele retorna a mensagem avisando da falta, se algum dado
  // constar no sistema, ele retorna uma mensagem avisando que tal dado já existe.
  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const register = await Register.create(req.body);

      const axios = require('axios').default;

      axios
        .post('http://127.0.0.1:3000/balance', {
          name: req.body.name,
          cpf: req.body.cpf,
          saldo: 0,
        })
        .then(function (response: any) {
          console.log(response.data);
        })
        .catch(function (error: any) {
          console.log(error);
        });

      return res.send('Conta criada com sucesso!');
    } catch (error) {
      if (error.errors === undefined) {
        const duplicateData = Object.keys(error.keyValue);
        return res
          .status(409)
          .send(`Este ${String(duplicateData).toUpperCase()} já existe no sistema!`);
      }

      const requiredData = Object.keys(error.errors);
      return res.status(400).send(`${String(requiredData).toUpperCase()} é requerido!`);
    }
  }

  // Função para deletar registro de usuário.
  // Ao deletar o registro de usuário o Saldo com o mesmo CPF é excluído.
  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    const register = await Register.findById(id);
    // const balance = await Balance.deleteOne({ cpf: register?.cpf });
    register?.deleteOne();

    return res.send(register);
  }
}

export default RegisterController;
