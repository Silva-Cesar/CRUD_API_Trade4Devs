import App from './app';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';
import OperationController from './controllers/OperationController';
import BalanceController from './controllers/BalanceController';
import RegisterController from './controllers/RegisterController';
import StatementController from './controllers/StatementController';

const app = new App([ 
    new ProductController(), 
    new  UserController(), 
    new OperationController(), 
    new BalanceController(), 
    new RegisterController(), 
    new StatementController()
]);

app.listen(3000);
