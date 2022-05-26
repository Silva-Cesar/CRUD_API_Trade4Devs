import { NextFunction, Request, Response } from 'express';
import Product from '../schemas/Product';
import Controller from './Controller';
import { Types } from 'mongoose';

class ProductController extends Controller {
  constructor() {
    super('/product');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.post(this.path, this.create);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const products = await Product.find();
    return res.send(products);
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const product = await Product.create(req.body);

    return res.send(product);
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).send('Id Inválido');
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).send('Produto não encontrado');
    }

    return res.send(product);
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, req.body);
    const product = await Product.findById(id);
    return res.send(product);
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    // const product = await Product.findById(id);
    // product?.deleteOne();
    await Product.deleteOne({ id });
    return res.status(204);
  }
}

export default ProductController;
