import { NextFunction, Request, Response } from 'express';
import Operation from '../schemas/Operation';
import Balance from '../schemas/Balance';
import Register from '../schemas/Register';
import Controller from './Controller';
import { Types } from 'mongoose';


class OperationController extends Controller {
  constructor() {
    super('/operation');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.get(`${this.path}/all`, this.listAll);
    this.router.post(this.path, this.create);
    this.router.delete(this.path, this.delete); //`${this.path}/:id`
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {

    return res.send('Base de operações.');
  }

  private async listAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const operation = await Operation.find();

    return res.send(operation);
  }

  // Função principal de Operation
  // Função para realizar a operação de transferência.
  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {

    const bodyReq = req.body;

    if (bodyReq.value != Number(bodyReq.value).toFixed(2)) {
      return res.status(400).send('Valor com mais de duas casas decimais!')
    };

    const findSender = await Register.find({ cpf: bodyReq.sender });
    const findReceiver = await Register.find({ cpf: bodyReq.receiver });
    const checkBalance = await Balance.find({ cpf: bodyReq.sender });

    if (!findSender.length || !findReceiver.length) {
      return res.status(400).send('CPF de remetente e/ou destinatário não encontrado(s).');
    };

    if (checkBalance[0].saldo < bodyReq.value) {
      return res.status(400).send('Operação cancelada - Saldo insulficiente!');
    };

    const { id , sender , receiver, value } = await Operation.create(req.body); // Cria a operação de transferência.

    
    if (!Types.ObjectId.isValid(id)) { // Verifica se o Id da operação criada é válido.
      return res.status(500).send('Id Inválido'); 
    }
    
    // Faz alteração no Balance, incrementa em receiver o valor transferido e decrementa em sender.
    const senderUser = await Balance.findOneAndUpdate({ cpf: sender }, { $inc: {saldo: -value} });
    const receiverUser = await Balance.findOneAndUpdate({ cpf: receiver }, { $inc: {saldo: value} });
    

    // chamar api extrato

    const axios = require('axios').default;
    const date = new Date();

    axios.post('http://127.0.0.1:3000/statement', {
      cpf : sender,
      year : date.getUTCFullYear(),
      month : date.getUTCMonth(),
      //operations : `[{${id}}]`
      operations : [{_id : id}]
    })
    //.then(function (response) {
    //  console.log(response);
      .then(function (response: any) {
        console.log(response);        
    })
    //.catch(function (error) {
    //  console.log(error);
      .catch(function (error: any) {
        console.log(error);        
    });

    axios.post('http://127.0.0.1:3000/statement', {
      cpf : receiver,
      year : date.getUTCFullYear(),
      month : date.getUTCMonth(),
      //operations : `[{${id}}]`
      operations : [{_id : id}]
    })
    //.then(function (response) {
    //  console.log(response);
      .then(function () {
        console.log();        
    })
    //.catch(function (error) {
    //  console.log(error);
      .catch(function () {
        console.log();        
    });

    return res.status(200).send('Transferência realizada com sucesso!');

  }

  // Criar função para validar as duas casas decimais!!!

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const operation = await Operation.deleteMany({});
    // operation.deleteOne();
    return res.send("Deleted");
  }
}

export default OperationController;
