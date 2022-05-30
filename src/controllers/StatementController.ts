import { NextFunction, Request, Response } from 'express';
import Statement from '../schemas/Statement';
import Controller from './Controller';
import { ValidatorCPF } from '../utils/ValidatorCPF';
import Operation from '../schemas/Operation';

class StatementController extends Controller {
  constructor() {
    super('/statement');
  }

  protected initRoutes(): void {

    this.router.post(`${this.path}/add`, this.create);
    this.router.post(`${this.path}/list`, this.list);

  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {

    const { cpf, month, year, days } = req.body;

    if (cpf) {

      if (days) {

        return res.send(await Statement.find(
          {
            cpf: cpf
          })
          .populate('operations', ' -__v -_id -deletedAt -updatedAt ')
          .where(Operation
            .find({ createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } })
            .select(' -__v -_id -deletedAt -createdAt -updatedAt')
          ));
      }

      if ((year) && (month)) {

        // resolver horario que nao esta em UTC

        //console.log(new Date(year, month, 1, 0, 0, 0), "/", new Date(year, month, new Date(year, month + 1, 0).getDate(), 0, 0, 0));


        return res.send(await Statement.find(
          {
            cpf: cpf,
            year : year,
            month : month
          })
          .populate('operations', ' -__v -_id -deletedAt -updatedAt ')
          //.where(Operation
          //  .find({ createdAt: { $gte: new Date(year, month, 1, 0, 0, 0), $lte: new Date(year, month, new Date(year, month + 1, 0).getDate(), 0, 0, 0) } }))
            .select(' -__v -_id -deletedAt -createdAt -updatedAt')
        //)
          );


      }

      if (month) {

        // resolver horario que nao esta em UTC

        //console.log(new Date(year, month, 1, 0, 0, 0), "/", new Date(year, month, new Date(year, month + 1, 0).getDate(), 0, 0, 0));

        if (month > new Date().getUTCMonth()) {
          // mes do ano anterior
          return res.send(await Statement.find(
            {
              cpf: cpf,
              year : `${year} - 1`,
              month : month
            })
            .populate('operations', ' -__v -_id -deletedAt -updatedAt ')
            //.where(Operation
              //.find({ createdAt: { $gte: new Date(new Date().getUTCFullYear() - 1, month, 1, 0, 0, 0), $lte: new Date(new Date().getUTCFullYear() - 1, month, new Date(year, month + 1, 0).getDate(), 0, 0, 0) } })
              .select(' -__v -_id -deletedAt -createdAt -updatedAt')
              //)
            );

        } else {
          // mes do ano corrente

          return res.send(await Statement.find(
            {
              cpf: cpf,
              month : month,
              year : year
            })
            .populate('operations', ' -__v -_id -deletedAt -updatedAt ')
            //.where(Operation  
            //.find({ createdAt: { $gte: new Date(new Date().getUTCFullYear(), month, 1, 0, 0, 0), $lte: new Date(new Date().getUTCFullYear(), month, new Date(year, month + 1, 0).getDate(), 0, 0, 0) } })
              .select(' -__v -_id -deletedAt -createdAt -updatedAt')
              //)
            );
        }
      }

      return res.send(await Statement.find(
        {
          cpf: cpf
        })
        .populate('operations', ' -__v -_id -deletedAt -updatedAt ')
        //.where(Operation
        .select(' -__v -_id -deletedAt -createdAt -updatedAt')
        // )
      );

    }

    return res.status(400);

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

}

export default StatementController;
