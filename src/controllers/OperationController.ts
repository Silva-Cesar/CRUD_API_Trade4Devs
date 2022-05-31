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
    // this.router.get(this.path, authMiddleware, this.list);
    this.router.post(this.path, authMiddleware, this.create);
  }

  // FUNÇÃO PRINCIPAL DA API OPERATION
  // Função para realizar a operação de transferência entre dois CPFs.
  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {

    const bodyReq = req.body;

    // Verifica se o valor digitado é menor ou igual a zero.
    if(bodyReq.value <= 0){
      return res.status(400).send({error: 'Valor Inválido, valor deve ser positivo!'})
    }

    // Verifica se o valor digitado possui mais que duas casas decimais.
    if (bodyReq.value != Number(bodyReq.value).toFixed(2)) {
      return res.status(400).send({error: 'Valor com mais de duas casas decimais!'})
    };

    // Faz uma busca na base de dados de registro e de saldo com os CPFs informados.
    const findSender = await Register.find({ cpf: bodyReq.sender });
    const findReceiver = await Register.find({ cpf: bodyReq.receiver });
    const checkBalance = await Balance.find({ cpf: bodyReq.sender });

    // Verifica se ambos os CPFs estão na base de dados de Registro.
    if (!findSender.length || !findReceiver.length) {
      return res.status(400).send({error: 'CPF de remetente e/ou destinatário não encontrado(s).'});
    };

    // Verifica se o "sender" possui saldo maior que o valor informado.
    if (checkBalance[0].balance < bodyReq.value) {
      return res.status(400).send({error: 'Operação cancelada - Saldo insulficiente!'});
    };

    const { id , sender , receiver, value } = await Operation.create(req.body); // Cria a operação de transferência.

    
    if (!Types.ObjectId.isValid(id)) {        // Verifica se o Id da operação criada é válido.
      return res.status(500).send({error: 'Id Inválido'}); 
    }
    
    // Faz alteração no Balance, incrementa em receiver o valor transferido e decrementa em sender.
    const senderUser = await Balance.findOneAndUpdate({ cpf: sender }, { $inc: {balance: -value} });
    const receiverUser = await Balance.findOneAndUpdate({ cpf: receiver }, { $inc: {balance: value} });
    

    // Chama API Statement via Axios.
    const axios = require('axios').default;
    const date = new Date();

    // Envia CPF de sender e receiver, mês, ano e Id da operação para que seja utilizada pelo statement.

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
        console.log(response.data);        
    })
      .catch(function (error: any) {
        console.log(error.response.data);        
    });

    return res.status(200).send({message: 'Transferência realizada com sucesso!'});

  }

  // Função criada para testes em ambiente de desenvolvimento.
  // Retorna todas as operações feitas.
  // private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const operation = await Operation.find();

  //   return res.send(operation);
  // }

}

export default OperationController;
