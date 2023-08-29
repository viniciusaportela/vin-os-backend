import { server } from "../../server";
import { IListFromPlayer } from "./transfers.interface";

export class TransfersService {
  async listFromPlayer(body: IListFromPlayer) {
    const transfers = await server.database.read(
      `SELECT transfers.*, from_p.name AS from_name, to_p.name AS to_name FROM transfers INNER JOIN players AS from_p ON from_p.id = transfers.from_player INNER JOIN players AS to_p ON to_p.id = transfers.to_player WHERE from_player = ? OR to_player = ? ORDER BY createdAt DESC`,
      [body.playerId, body.playerId]
    );
    return transfers ?? [];
  }
}
