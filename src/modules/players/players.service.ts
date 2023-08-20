import { server } from "../../server";
import { IGiveCoins, IRegister } from "./players.interface";

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

  async giveCoins(body: IGiveCoins) {
    const player = await server.database.read(
      `SELECT * FROM players WHERE name = ?`,
      [body.playerName]
    );

    if (player[0]) {
      await server.database.write(
        `UPDATE players SET coins = coins + ? WHERE id = ?`,
        [body.amount, player[0].id]
      );
    } else {
      throw Error("Player doesn't exists");
    }
  }
}
