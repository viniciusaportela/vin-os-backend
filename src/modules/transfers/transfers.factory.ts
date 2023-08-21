import { TransfersController } from "./transfers.controller";
import { TransfersService } from "./transfers.service";

export class TransfersFactory {
  static controller: TransfersController;
  static service: TransfersService;

  static createController() {
    if (!this.controller) {
      this.controller = new TransfersController(this.createService());
    }

    return this.controller;
  }

  static createService() {
    if (!this.service) {
      this.service = new TransfersService();
    }

    return this.service;
  }
}
