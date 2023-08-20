import { server } from "../../server";
import { IRegister } from "./players.interface";

const INITIAL_COINS = 100;

export class PlayersService {
  async register(body: IRegister) {
    for (const player of body.players) {
      await server.database.write(
        `INSERT INTO players(name, coins) VALUES (?, ?) ON CONFLICT (name) DO UPDATE SET coins=coins`,
        [player, INITIAL_COINS]
      );
    }
  }
}
