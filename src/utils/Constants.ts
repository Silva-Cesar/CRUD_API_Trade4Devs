import 'dotenv/config';

export class Constants {

    // NodeJS
    static readonly SERVER_PORT: number = Number(process.env.PORT) || 3000;
    static readonly SERVER_HOST: string = process.env.HOST || '0.0.0.0';

    // MongoDB
    static readonly MONGO_DB_USER: string = process.env.MONGO_DB_USER || 'admin';
    static readonly MONGO_DB_PASS: string = process.env.MONGO_DB_PASS || 'pass';
    static readonly MONGO_DB_CLUSTER: string = process.env.MONGO_DB_CLUSTER || 'locahost';
    static readonly MONGO_DB: string = "crud-nodejs";

    // Axios
    static readonly AXIOS_PROTOCOL: string = "http";
    static readonly AXIOS_SERVER: string = "127.0.0.1";
    static readonly AXIOS_PORT: number = Constants.SERVER_PORT;
    
}
