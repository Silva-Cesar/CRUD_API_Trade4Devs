import { NextFunction, Request, Response } from 'express';
import Statement from '../schemas/Statement';
import Controller from './Controller';
//import { Types } from 'mongoose';
import { ValidatorCPF } from '../utils/ValidatorCPF';
import Operation from '../schemas/Operation';

class StatementController extends Controller {
  constructor() {
    super('/statement');
  }

  protected initRoutes(): void {
    //this.router.get(`${this.path}/:cpf`, this.listByCPF);
    //this.router.get(`${this.path}/:cpf/:month`, this.list); 
    //this.router.get(`${this.path}/:cpf/:month/:year`, this.listAll); 
    //this.router.get(`${this.path}/:cpf/:month/:year/:timezone`, this.listAll); 
    this.router.post(`${this.path}/add`, this.create);
    this.router.post(`${this.path}/list`, this.list);

  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    //const statements = await Statement.find();

    //if (statements.length > 0) {
    //  return res.send(statements);
    //} else {
    //  return res.status(400).send('Nenhum extrato encontrado');
    //}

    const cpf = req.body.cpf;
    const month = req.body.month;
    const year = req.body.year;
    //const timezone = req.body.timezone;
    const days = req.body.days; // dias retroativos ao dia atual

    if (cpf) {

      if (days) {

        console.log(days, "/" , cpf);

        //const query = Statement.find();
        //query.setOptions({lean : true});
        //(await query).forEach(Statement.operations);
        //query.where('createdAt').gte(Date.now() - days*24*60*60*1000).exec(callback);

        const statement = await Statement.find({'cpf': cpf});
        //const statement = await Statement.find() ;
        console.log(statement);
        return res.send(statement );

        return res.send ( await Statement.find(
          {
            cpf : cpf
            //operations.operation.createdAt : {$gte: Date.now() - days*24*60*60*1000}

          }).populate('operations').where(Operation.find( {createdAt : { $gte: Date.now() - days*24*60*60*1000}})));
        //if (timezone) {
          // todos os extratos do cpf no timezone solicitado

        //} else {
          // todos os extratos 

        //}

      }

      //if (!month) {
        // todos os extratos do cpf

        //if (timezone) {
          // todos os extratos do cpf no timezone solicitado

        //} else {
          // todos os extratos 

        //}
     // }

    }


    return res.status(400);

  }

  private async listAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    return res.send(await Statement.find().populate('operations'));
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    // verificar se os ids que vierem em " operations " sao do tipo Operation mesmo!!!

    try {

      if (ValidatorCPF.validator(req.body.cpf)) {

        return res.send(
          await Statement.updateOne(
            {
              month: req.body.month,
              year: req.body.year,
              cpf: req.body.cpf,
            },
            {
              $addToSet: { operations: { $each: req.body.operations } },
            },
            {
              upsert: true,
              runValidators: true,
            }
          )
        );
      } 
    } catch (error) {

    }

    return res.status(400);

  }

  private async listByCPF(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { cpf } = req.params;

    return res.send(ValidatorCPF.validator(cpf));

    //    if (!Types.ObjectId.isValid(id)) {
    //      return res.status(400).send('Id Inválido');
    //    }

    const statement = await Statement.find({ cpf: cpf });

    if (statement.length > 0) {
      return res.send(statement);
    } else {
      return res.status(400).send('Extrato não encontrado');
    }
  }

  /*
  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).send('Id Inválido');
    }

    const statement = await Statement.findById(id);

    if (!statement) {
      return res.status(400).send('Produto não encontrado');
    }

    return res.send(statement);
  }
  */

}

export default StatementController;
