import { server } from "../../server";
import {
  IGetPlayer,
  IGiveCoins,
  IRegister,
  ITransferCoins,
} from "./players.interface";

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

  async getPlayer(body: IGetPlayer) {
    const player = await server.database.read(
      `SELECT * FROM players WHERE name = ?`,
      [body.playerName]
    );

    if (player[0]) {
      return player[0];
    } else {
      throw Error("Player not found");
    }
  }

  async transferCoins(body: ITransferCoins) {
    const fromPlayer = await server.database.read(
      `SELECT * FROM players WHERE name = ?`,
      [body.from]
    );

    const toPlayer = await server.database.read(
      `SELECT * FROM players WHERE name = ?`,
      [body.to]
    );

    if (fromPlayer[0] && toPlayer[0]) {
      if (fromPlayer[0].coins < body.amount) {
        throw Error(`"from" player doesn't have enough money to transfer`);
      }

      await server.database.write(
        `
        INSERT INTO transfers(from_player, to_player, amount) VALUES(?, ?, ?)
      `,
        [fromPlayer[0].id, toPlayer[0].id, body.amount]
      );

      await server.database.write(
        `UPDATE players SET coins = coins - ? WHERE name = ?`,
        [body.amount, body.from]
      );

      await server.database.write(
        `UPDATE players SET coins = coins + ? WHERE name = ?`,
        [body.amount, body.to]
      );
    } else {
      throw Error(`"from" or "to" player not found`);
    }
  }
}
