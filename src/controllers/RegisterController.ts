import { NextFunction, Request, Response } from 'express';
import Register from '../schemas/Register';
import Balance from '../schemas/Balance';
import Controller from './Controller';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ValidatorCPF } from '../utils/ValidatorCPF';
import { authMiddleware } from '../utils/middlewares/authMiddleware';


class RegisterController extends Controller {
  constructor() {
    super('/register');
  }

  protected initRoutes(): void {
    this.router.get(this.path, authMiddleware, this.getAll); // Remover esta funcão
    this.router.get(`${this.path}/me`, authMiddleware, this.getUserInfo);
    this.router.post(this.path, this.create);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.delete);
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Retorna todos os registros cadastrados.
  private async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const register = await Register.find().select({ __v: 0 });
    return res.send(register);
    // return res.send('Registro de todos os usuários'); - No projeto final usar esse return
  }

  private async getUserInfo(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const token = req.headers.authorization!
    const { data }: any = jwt.decode(token)
    const cpf = data.cpf
    const register = await Register.find({cpf}).select({password: 0, __v: 0 });
    return res.send(register);
  }

  // FUNÇÃO PRINCIPAL DA API DE REGISTRO
  // Função para criar um registro de usuário.
  // Ao ser criado o registro do usuário, é criado um documento na API de Saldo
  // com o CPF do usuário e o saldo com valor igual a 1000.
  // Se algum dado estiver faltando ele retorna a mensagem avisando da falta, se algum dado
  // constar no sistema, ele retorna uma mensagem avisando que tal dado já existe.
  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { name, email, phone,birth_date, cpf, password } = req.body;
      
      const isValidCpf = ValidatorCPF.validator(cpf)
      if(!isValidCpf){
        return res.status(400).send({error: `O cpf ${cpf} é inválido!`});
      }

      const bcryptSalt = 15; // Quantidade de salting.

      const register = await Register.create({
        name: name,
        email: email,
        phone: phone,
        birth_date: birth_date,
        cpf: cpf,
        password: await bcrypt.hash(password, bcryptSalt)
      });

      const balance = await Balance.create({ ...req.body, balance: 0})

      return res.send({message: 'Conta criada com sucesso!'});
    } catch (error) {

      // Caso o erro seja de duplicidade, volta este erro.
      if (error.errors === undefined) {
        const duplicateData = Object.keys(error.keyValue);
        return res
          .status(409)
          .send({error: `Este ${String(duplicateData).toUpperCase()} já existe no sistema!`});
      }

      // Caso o erro seja de falta de informação, volta este erro.
      const requiredData = Object.keys(error.errors);
      return res.status(400).send({error: `${String(requiredData).toUpperCase()} é requerido!`});
    }
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Função para deletar registro de usuário pelo Id.
  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    const register = await Register.findById(id);

    register?.deleteOne();

    return res.send(register);
  }
}

export default RegisterController;
