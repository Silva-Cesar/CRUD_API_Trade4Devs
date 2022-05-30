import { NextFunction, Request, Response } from 'express';
import Operation from '../schemas/Operation';
import Balance from '../schemas/Balance';
import Register from '../schemas/Register';
import Controller from './Controller';
import { Types } from 'mongoose';
import { Constants } from '../utils/Constants';
import { authMiddleware } from '../utils/middlewares/authMiddleware';


class OperationController extends Controller {
  constructor() {
    super('/operation');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.post(this.path, this.create);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Retorna todas as operações feitas.
  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const operation = await Operation.find();

    return res.send(operation);
  }

  // FUNÇÃO PRINCIPAL DA API OPERATION
  // Função para realizar a operação de transferência entre dois CPFs.
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

    if (checkBalance[0].balance < bodyReq.value) {
      return res.status(400).send('Operação cancelada - Saldo insulficiente!');
    };

    const { id , sender , receiver, value } = await Operation.create(req.body); // Cria a operação de transferência.

    
    if (!Types.ObjectId.isValid(id)) { // Verifica se o Id da operação criada é válido.
      return res.status(500).send('Id Inválido'); 
    }
    
    // Faz alteração no Balance, incrementa em receiver o valor transferido e decrementa em sender.
    const senderUser = await Balance.findOneAndUpdate({ cpf: sender }, { $inc: {balance: -value} });
    const receiverUser = await Balance.findOneAndUpdate({ cpf: receiver }, { $inc: {balance: value} });
    

    // chamar api extrato

    const axios = require('axios').default;
    const date = new Date();

    axios.post(`${Constants.AXIOS_PROTOCOL}://${Constants.AXIOS_SERVER}:${Constants.AXIOS_PORT}/statement/add`, {
      cpf : sender,
      year : date.getUTCFullYear(),
      month : date.getUTCMonth(),
      operations : [{_id : id}]
    })
      .then(function (response: any) {
        console.log(response);        
    })
      .catch(function (error: any) {
        console.log(error);        
    });

    axios.post(`${Constants.AXIOS_PROTOCOL}://${Constants.AXIOS_SERVER}:${Constants.AXIOS_PORT}/statement/add`, {
      cpf : receiver,
      year : date.getUTCFullYear(),
      month : date.getUTCMonth(),
      operations : [{_id : id}]
    })
      .then(function (response: any) {
        console.log(response);        
    })
      .catch(function (error: any) {
        console.log(error);        
    });

    return res.status(200).send('Transferência realizada com sucesso!');

  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Função para deletar uma operação pelo seu Id.
  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const operation = await Operation.findById(id);
    operation?.deleteOne();
    return res.send("Deleted");
  }
}

export default OperationController;
