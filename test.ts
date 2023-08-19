import { WebSocket } from "ws";

const ws = new WebSocket("ws://localhost:8080", {
  perMessageDeflate: false,
});

ws.on("open", () => {
  ws.send(
    JSON.stringify({
      command: "register-computer",
      computerId: 1,
      userName: "Vini",
    })
  );
  ws.send(
    JSON.stringify({
      command: "register-computer",
      computerId: 2,
      userName: "Vini",
    })
  );

  ws.send(
    JSON.stringify({
      command: "register-computer",
      computerId: 3,
      userName: "Luck",
    })
  );

  ws.send(
    JSON.stringify({
      command: "enter-mining",
      computerId: 1,
    })
  );
});
