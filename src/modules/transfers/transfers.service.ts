import { server } from "../../server";
import { IListFromPlayer } from "./transfers.interface";

export class TransfersService {
  async listFromPlayer(body: IListFromPlayer) {
    const transfers = await server.database.read(
      `SELECT * FROM transfers WHERE from_player = ? OR to_player = ?`,
      [body.playerId, body.playerId]
    );
    return transfers ?? [];
  }
}
