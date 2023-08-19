import "reflect-metadata";
import { WebSocketServer } from "ws";
import { Database } from "./database";
import express from "express";
import cors from "cors";
import { MiningFactory } from "./modules/mining/mining.factory";

class Server {
  database: Database = null as unknown as Database;
  wss: WebSocketServer = null as unknown as WebSocketServer;
  app: express.Express = null as unknown as express.Express;

  wssRoutes = new Map();

  async spinUp() {
    this.database = new Database();
    this.wss = new WebSocketServer({
      port: 8080,
    });
    this.app = express();

    this.app.use(express.json());
    this.app.use(cors());

    this.setupRoutes();

    this.app.listen(3000, () => {
      console.log("HTTP Server started at port 3000");
    });

    console.log("Server Started");
  }

  setupRoutes() {
    this.registerController(MiningFactory.createController());

    // this.wss.on("connection", (ws) => {
    //   ws.on("message", async (rawMessage) => {
    //     const parsedMessage = JSON.parse(rawMessage.toString());
    //     console.log(`Received message =>`, parsedMessage);

    //     // await mcController(decodedMessage, ws);
    //   });
    // });
  }

  registerController(controller: any) {
    // If has http routes add to express
    // If has websocket routes add to wss
  }
}

new Server().spinUp();

// async function mcController(message, ws) {
//   if (message.command === "enter-mining") {
//     enterMining(message, wss);
//   } else if (message.command === "register-computer") {
//     registerComputer(message, wss);
//   } else if (message.command === "hello") {
//     setTimeout(() => {
//       ws.send("Hello from server");
//     }, 1000);
//   }
// }
