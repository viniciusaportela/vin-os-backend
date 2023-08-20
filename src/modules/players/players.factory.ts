import { PlayersController } from "./players.controller";
import { PlayersService } from "./players.service";

export class PlayersFactory {
  static controller: PlayersController;
  static service: PlayersService;

  static createController() {
    if (!this.controller) {
      this.controller = new PlayersController(this.createService());
    }

    return this.controller;
  }

  static createService() {
    if (!this.service) {
      this.service = new PlayersService();
    }

    return this.service;
  }
}
