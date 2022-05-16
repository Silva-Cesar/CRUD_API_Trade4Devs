import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Controller from './controllers/Controller';

class App {
  public app: express.Application;

  public constructor(controllers: Controller[]) {
    this.app = express();
    this.app.use(cors());

    this.initMongoose();
    this.connectDataBase();
    this.initExpressJson();
    this.initControllers(controllers);
  }

  private initMongoose(): void {
    mongoose.set('runValidators', true);
  }

  private connectDataBase(): void {
    mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@${process.env.MONGO_DB_CLUSTER}/crud-nodejs?retryWrites=true&w=majority`)
  }

  private initExpressJson(): void {
    this.app.use(express.json());
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    })
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Application is running on port ${port}`)
    })
  }
}

export default App;
