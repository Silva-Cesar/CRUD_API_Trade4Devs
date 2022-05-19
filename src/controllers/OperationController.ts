import { NextFunction, Request, Response } from 'express';
import Operation from '../schemas/Operation';
import Controller from './Controller';
import Product from '../schemas/Product';
// import { Types } from 'mongoose';


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
    const testLink = await Product.findOneAndUpdate({price: 800}, {$inc: {quantity: -30}});
    const operation = await Operation.find();
    return res.send(testLink);
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const bodyReq = req.body;

    if (bodyReq.cpf !== 22345678900) { // Validando CPF
      // Verificar CPF no registro.
      return res.status(404).send('CPF não encontrado');
    };

    const myArray = ["entrada", "saida"];
    if (!myArray.includes(bodyReq.tipo)) { // Validando tipo da operação
      return res.status(400).send(`Tipo precisa ser "entrada" ou "saida"!`);
    };

    if (bodyReq.tipo === "saida" && bodyReq.value > 1000) { // Verificando se saida é maior que saldo
      return res.status(400).send('Saldo insulficiente.');
    };

    // Criar função para validar as duas casas decimais!!!

    const operation = await Operation.create(bodyReq);
    return res.send('status: Ok');
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const operation = await Operation.deleteMany({});
    // operation.deleteOne();
    return res.send("Deleted");
  }
}

export default OperationController;
