import { server } from "../../server";
import { IListProcessedBlocksWithPlayer, IMine } from "./mining.interface";

const MINING_COOLDOWN_MS = 60_000;
const MININGS_PER_BLOCK = 100;
const MINE_MAX_VALUE = 1_000_000;
const GAIN_FACTOR = 2.32 / 1_000_000;

export class MiningService {
  async mine(body: IMine) {
    const computerRes = await server.database.read(
      "SELECT * FROM computers WHERE id = ?",
      [body.computerId]
    );

    if (computerRes.length > 0) {
      const computer = computerRes[0];

      if (computer.type === "miner") {
        const miningRes = await server.database.read(
          "SELECT * FROM minings WHERE computerId = ? ORDER BY time DESC LIMIT 1",
          [body.computerId]
        );

        if (miningRes.length > 0) {
          if (
            new Date().getTime() <
            new Date(miningRes[0].time).getTime() + MINING_COOLDOWN_MS
          ) {
            throw Error("Computer is already mining");
          }
        }

        const miningResult = await server.database.exec(
          `INSERT INTO minings(computerId) VALUES(?) RETURNING blockIndex, time, computerId`,
          [body.computerId]
        );

        const miningsMeta = await server.database.read(
          `SELECT * FROM minings_meta LIMIT 1`
        );
        if (miningsMeta.length > 0) {
          const lastBlockIndex =
            miningsMeta[0].lastProcessedBlock * MININGS_PER_BLOCK;

          const hasPassedThreshold =
            miningResult.blockIndex >= lastBlockIndex + MININGS_PER_BLOCK;
          if (hasPassedThreshold) {
            await this.processBlock(miningsMeta, lastBlockIndex);
          }
        } else {
          throw new Error("Minings Meta is not initialized");
        }
      } else {
        throw Error("Can't mine in a non-miner computer");
      }
    } else {
      throw Error("This computer was not registered");
    }
  }

  private async processBlock(miningsMeta: any, lastBlockIndex: number) {
    const randomIndex =
      1 + lastBlockIndex + Math.floor(Math.random() * MININGS_PER_BLOCK);

    const miningRes = await server.database.read(
      `SELECT * FROM minings WHERE blockIndex = ?`,
      [randomIndex]
    );

    if (miningRes[0]) {
      const computer = await server.database.read(
        `SELECT * FROM computers WHERE id = ?`,
        [miningRes[0].computerId]
      );

      if (computer[0]) {
        const gainedCoins =
          GAIN_FACTOR * (await this.calculateRemainingCoins());

        await server.database.write(
          `INSERT INTO processed_blocks(winner, winnerIndex, gainedCoins, blockIndex) VALUES(?, ?, ?, ?)`,
          [
            computer[0].id,
            randomIndex,
            gainedCoins,
            miningsMeta[0].lastProcessedBlock,
          ]
        );

        await server.database.write(
          `UPDATE players SET coins = coins + ? WHERE id = ?`,
          [gainedCoins, computer[0].owner]
        );

        await server.database.write(
          `UPDATE minings_meta SET lastProcessedBlock = ?, minedCoins = minedCoins + ?`,
          [miningsMeta[0].lastProcessedBlock + 1, gainedCoins]
        );
      } else {
        throw Error(`Computer ID ${miningRes[0].computerId} not found`);
      }
    } else {
      throw Error(`Mining ID ${randomIndex} not found`);
    }
  }

  async listProcessedBlocksWithPlayer(body: IListProcessedBlocksWithPlayer) {
    const blocks = await server.database.read(
      `SELECT * FROM processed_blocks INNER JOIN computers ON computers.id = processed_blocks.winner WHERE computers.owner = ?`,
      [body.playerId]
    );

    return blocks;
  }

  async listProcessedBlocks() {
    const blocks = await server.database.read(`SELECT * FROM processed_blocks`);

    return blocks;
  }

  private async calculateRemainingCoins() {
    const miningsMeta = await server.database.read(
      "SELECT * FROM minings_meta LIMIT 1"
    );

    if (miningsMeta.length > 0) {
      return MINE_MAX_VALUE - miningsMeta[0].minedCoins;
    } else {
      throw Error("Minings Meta is not initialized");
    }
  }
}
