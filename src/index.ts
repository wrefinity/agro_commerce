import cookieParser from 'cookie-parser';
import express, { Express, Application } from "express";
import session from "express-session";
import { APP_SECRET, PORT } from "./secrets";
import { PrismaClient } from "@prisma/client";


export const prismaClient: PrismaClient = new PrismaClient(
  {
    log: ['query']
  }
);

class Server {
  public app: Express;
  private port: number;
  private appSecret: string;

  constructor(port: number, secret: string) {
    this.app = express();
    this.port = port;
    this.appSecret = secret;

    // Initialize middleware and routes
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    // initialize any middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(session({
      secret: this.appSecret,
      resave: false,
      saveUninitialized: false
    }));
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    this.app.get('/', this.rootHandler);
  }

  private rootHandler(req: Request, res: Response) {
    return res.status(200).json({message:'we are up and running'});
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}


const server = new Server(Number(PORT), APP_SECRET);
server.listen();