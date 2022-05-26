import { NextFunction, Request, Response } from 'express';
import Operation from '../schemas/Operation';
import Controller from './Controller';
import { Types } from 'mongoose';


class OperationController extends Controller {
  constructor() {
    super('/operation');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.post(this.path, this.create);
    this.router.delete(this.path, this.delete); //`${this.path}/:id`
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    //const testLink = await Product.findOneAndUpdate({price: 800}, {$inc: {quantity: -30}});
    const operation = await Operation.find();
    //return res.send(testLink);
    return res.send(operation);
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    //const bodyReq = req.body;

    const { id , sender , receiver } = await Operation.create(req.body);

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).send('Id Inválido');
    } else {

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

      return res.status(200).send('ok');
    }
  }
    
    //if (bodyReq.cpf !== 22345678900) { // Validando CPF
      // Verificar CPF no registro.
    //  return res.status(404).send('CPF não encontrado');
    //};

    //const myArray = ["entrada", "saida"];
    //if (!myArray.includes(bodyReq.tipo)) { // Validando tipo da operação
//      return res.status(400).send(`Tipo precisa ser "entrada" ou "saida"!`);
    //};

    //if (bodyReq.tipo === "saida" && bodyReq.value > 1000) { // Verificando se saida é maior que saldo
//      return res.status(400).send('Saldo insulficiente.');
//    };

    // Criar função para validar as duas casas decimais!!!

//    const operation = await Operation.create(bodyReq);
//    return res.send('status: Ok');
//  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const operation = await Operation.deleteMany({});
    // operation.deleteOne();
    return res.send("Deleted");
  }
}

export default OperationController;
