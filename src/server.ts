import "reflect-metadata";
import { WebSocketServer, WebSocket } from "ws";
import { Database } from "./database";
import express from "express";
import cors from "cors";
import { MiningFactory } from "./modules/mining/mining.factory";
import { IController, IHttpRouteMeta } from "./core/controller-decorators";
import { httpWrapper, wssWrapper } from "./core/controller-wrappers";
import { ComputersFactory } from "./modules/computers/computers.factory";
import { PlayersFactory } from "./modules/players/players.factory";

class Server {
  database: Database = null as unknown as Database;
  wss: WebSocketServer = null as unknown as WebSocketServer;
  app: express.Express = null as unknown as express.Express;

  wssHandlers = new Map<string, { controller: IController; fn: Function }>();

  async spinUp() {
    this.database = new Database();
    this.wss = new WebSocketServer(
      {
        port: 8080,
      },
      () => {
        console.log("WSS Server started at port 8080");
      }
    );
    this.app = express();

    this.app.use(express.json());
    this.app.use(cors());

    this.setupRoutes();
    this.setupWsHandler();

    this.app.listen(3000, () => {
      console.log("HTTP Server started at port 3000");
    });

    console.log("Server Started");

    return this;
  }

  setupRoutes() {
    this.registerController(MiningFactory.createController());
    this.registerController(ComputersFactory.createController());
    this.registerController(PlayersFactory.createController());
  }

  setupWsHandler() {
    this.wss.on("connection", (ws) => {
      ws.on("message", async (message) => {
        await this.handleWsMessage(message.toString(), ws);
      });
    });
  }

  async handleWsMessage(message: any, ws: WebSocket) {
    const decodedMessage = JSON.parse(message);
    const command = decodedMessage.command;
    const body = decodedMessage.body;

    const handler = this.wssHandlers.get(command);

    if (handler) {
      await handler.fn.bind(handler.controller)(body, ws);
    } else {
      console.error("Command not found");
    }
  }

  registerController(controller: any) {
    const httpRoutes = controller.httpRoutes;
    httpRoutes.forEach((httpRoute: IHttpRouteMeta) => {
      const method = httpRoute.method.toLowerCase();

      this.app[method](
        httpRoute.route,
        httpWrapper(httpRoute.function, controller)
      );
    });

    const websocketRoutes = controller.websocketRoutes;
    websocketRoutes.forEach((websocketRoute: any) => {
      this.wssHandlers.set(websocketRoute.command, {
        controller,
        fn: wssWrapper(websocketRoute.function, controller),
      });
    });
  }
}

export const server = new Server();
server.spinUp();
