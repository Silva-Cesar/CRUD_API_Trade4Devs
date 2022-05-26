import App from './app';
import OperationController from './controllers/OperationController';
import BalanceController from './controllers/BalanceController';
import RegisterController from './controllers/RegisterController';
import StatementController from './controllers/StatementController';
import LoginController from './controllers/LoginController';

const PORT = Number(process.env.PORT) | 3000;

const app = new App([
  new OperationController(),
  new BalanceController(),
  new RegisterController(),
  new StatementController(),
  new LoginController(),
]);

app.listen(PORT);

app.get('Oi Express!');
