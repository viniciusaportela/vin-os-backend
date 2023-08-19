export const computersByPlayer = new Map();

export function registerComputer(message, wss) {
  const { computerId, userName } = message;

  if (computersByPlayer.has(userName)) {
    const set = computersByPlayer.get(userName);
    set.add(computerId);
  } else {
    computersByPlayer.set(userName, new Set([computerId]));
  }

  console.log(computersByPlayer);
}
