import { server } from "../../server";
import { IListFromPlayer, IRegister } from "./computers.interface";

export class ComputersService {
  async register(body: IRegister) {
    const playerRes = await server.database.read(
      `SELECT * FROM players WHERE name = ?`,
      [body.playerName]
    );

    if (playerRes.length > 0) {
      const player = playerRes[0];

      await server.database.write(
        `INSERT INTO computers(id, owner, type) VALUES (?, ?, ?) ON CONFLICT (id) DO UPDATE SET owner=owner`,
        [body.computerId, player.id, body.type ?? "common"]
      );
    } else {
      throw new Error("Player does not exists, register it first");
    }
  }

  async listComputersFromPlayer(body: IListFromPlayer) {
    const computers = await server.database.read(
      `SELECT * FROM computers WHERE owner = ?`,
      [body.playerId]
    );

    return computers;
  }
}
