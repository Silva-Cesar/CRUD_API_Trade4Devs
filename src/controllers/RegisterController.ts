import { NextFunction, Request, Response } from 'express';
import Register from '../schemas/Register';
import Balance from '../schemas/Balance';
import Controller from './Controller';
import * as bcrypt from 'bcrypt';
import { ValidatorCPF } from '../utils/ValidatorCPF';

class RegisterController extends Controller {
  constructor() {
    super('/register');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/cpf`, this.getByCPF);
    this.router.post(this.path, this.create);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Retorna todos os registros cadastrados.
  private async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const register = await Register.find().select({ __v: 0 });
    return res.send(register);
    // return res.send('Registro de todos os usuários'); - No projeto final usar esse return
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Retorna o registro onde consta o CPF requisitado.
  private async getByCPF(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { cpf } = req.body

    try {

      if (!cpf) {
        return res.status(400).send('Digite um cpf.'); // Caso não tenha requisição no body, envia mensagem de erro.
      }
  
      const register = await Register.find({cpf});
      return res.status(200).send(register);

    } catch (error) {
      return res.status(400).send(error);
    }
  }

  // FUNÇÃO PRINCIPAL DA API DE REGISTRO
  // Função para criar um registro de usuário.
  // Ao ser criado o registro do usuário, é criado um documento na API de Saldo
  // com o CPF do usuário e o saldo com valor igual a 1000.
  // Se algum dado estiver faltando ele retorna a mensagem avisando da falta, se algum dado
  // constar no sistema, ele retorna uma mensagem avisando que tal dado já existe.
  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {

      const bcryptSalt = 15; // Quantidade de salting.

      // Confere se o CPF é válido de acordo com as regras da Receita Federal.
      if (!ValidatorCPF.validator(req.body.cpf)) {
        return res.status(400).send('CPF inválido!')
      };

      const register = await Register.create({ // Função para criar o registro.
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        birth_date: req.body.birth_date,
        cpf: req.body.cpf,
        password: await bcrypt.hash(req.body.password, bcryptSalt) // Função para hashing do password.
      });

      // Cria um documento com o nome e CPF registrado e saldo de 1000 na API Balance.
      const balance = await Balance.create({ ...req.body, balance: 1000}); 

      return res.send('Conta criada com sucesso!');
    } catch (error) {

      // Caso o erro seja de duplicidade, volta este erro.
      if (error.errors === undefined) {
        const duplicateData = Object.keys(error.keyValue);
        return res
          .status(409)
          .send(`Este ${String(duplicateData).toUpperCase()} já existe no sistema!`);
      }

      // Caso o erro seja de falta de informação, volta este erro.
      const requiredData = Object.keys(error.errors);
      return res.status(400).send(`${String(requiredData).toUpperCase()} é requerido!`);
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
