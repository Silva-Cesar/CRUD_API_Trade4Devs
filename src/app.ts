import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Controller from './controllers/Controller';
import { Constants } from './utils/Constants';

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
    mongoose.connect(
      `mongodb+srv://${Constants.MONGO_DB_USER}:${Constants.MONGO_DB_PASS}@${Constants.MONGO_DB_CLUSTER}/${Constants.MONGO_DB}?retryWrites=true&w=majority`
    );
  }

  private initExpressJson(): void {
    this.app.use(express.json());
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen(port: number, host: string): void {
    this.app.listen(port, host, () => {
      console.log(`Application is running on host ${host} port ${port}`);
    });
  }

  public get(msg: string): void {
    this.app.get('/', (req, res) => {
      res.json({ message: msg });
    });
  }
}

export default App;
