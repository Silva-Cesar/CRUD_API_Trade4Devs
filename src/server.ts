import App from './app';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';
import OperationController from './controllers/OperationController';
import BalanceController from './controllers/BalanceController';
import RegisterController from './controllers/RegisterController';
import StatementController from './controllers/StatementController';
import LoginController from './controllers/LoginController';

const PORT = Number(process.env.PORT) | 3000;

const app = new App([
  new ProductController(),
  new UserController(),
  new OperationController(),
  new BalanceController(),
  new RegisterController(),
  new StatementController(),
  new LoginController(),
]);

app.listen(PORT);

app.get('Oi Express!');
