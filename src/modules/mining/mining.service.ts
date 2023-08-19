export class MiningService {
  mine(body: any) {}

  getStatus() {
    return {
      status: "ok",
    };
  }
}

// const miners = new Map();

// const mining = new Array();

// // TODO Increase when release
// const MININGS_PER_BLOCK = 3;
// const MINE_MAX_VALUE = 1_000_000;
// const MINE_COOLDOWN_MS = 4_000;

// // DEV Get this from DB
// let mined = 0;

// export function mine(message, wss) {
//   if (miners.has(message.computerId)) {
//     const miner = miners.get(message.computerId);

//     if (new Date().getTime() - miner.lastTimestamp < MINE_COOLDOWN_MS) {
//       console.warn("[Mining] Tried to mine before being able");
//       return;
//     }
//   }

//   miners.set(message.computerId, {
//     lastTimestamp: new Date().getTime(),
//   });

//   mining.push(message.computerId);

//   console.log("mine");
//   console.log(miners);
//   console.log(mining);

//   if (mining.length >= MININGS_PER_BLOCK) {
//     console.log("[Mining] Mining block was completed");

//     const randomValue = Math.floor(Math.random() * MINE_MAX_VALUE);
//     const winnerComputerId = mining[randomValue % MININGS_PER_BLOCK];

//     console.log(`[Mining] Winner is computer ${winnerComputerId}`);

//     for (const [userName, computers] of computersByPlayer.entries()) {
//       const hasFound = Array.from(computers).some(
//         (computerId) => computerId === winnerComputerId
//       );

//       if (hasFound) {
//         const gainedCoins = calculateGainedCoins();

//         coinsPerPlayer.set(
//           userName,
//           (coinsPerPlayer.get(userName) ?? 0) + gainedCoins
//         );
//         console.log("Send coins to", userName);

//         mining.length = 0;
//         miners.clear();
//         mined += gainedCoins;

//         console.log(coinsPerPlayer);
//         break;
//       }
//     }

//     mining.length = 0;
//   }
// }

// function calculateGainedCoins() {
//   return (1 / 10000) * calculateRemainingCoins();
// }

// function calculateRemainingCoins() {
//   return MINE_MAX_VALUE - mined;
// }
