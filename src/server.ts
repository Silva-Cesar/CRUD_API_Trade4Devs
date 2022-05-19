import App from './app';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';
import OperationController from './controllers/OperationController';

const app = new App([ new ProductController(), new  UserController(), new OperationController() ]);

app.listen(3000);
