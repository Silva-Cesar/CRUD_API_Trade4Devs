import App from './app';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';

const app = new App([ new ProductController(), new  UserController() ]);

app.listen(3000);
