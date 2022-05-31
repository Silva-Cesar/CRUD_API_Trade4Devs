import App from './app';
import OperationController from './controllers/OperationController';
import BalanceController from './controllers/BalanceController';
import RegisterController from './controllers/RegisterController';
import StatementController from './controllers/StatementController';
import LoginController from './controllers/LoginController';
import { Constants } from './utils/Constants';

const app = new App([
  new OperationController(),
  new BalanceController(),
  new RegisterController(),
  new StatementController(),
  new LoginController(),
]);

app.listen(Constants.SERVER_PORT, Constants.SERVER_HOST);

app.get('Oi Express!');
