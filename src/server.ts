import App from './app';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';
import OperationController from './controllers/OperationController';
import BalanceController from './controllers/BalanceController';

const app = new App([ new ProductController(), new  UserController(), new OperationController(), new BalanceController()]);

app.listen(3000);
