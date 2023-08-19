import { MiningController } from "./mining.controller";
import { MiningService } from "./mining.service";

export class MiningFactory {
  static controller: MiningController;
  static service: MiningService;

  static createController() {
    if (!this.controller) {
      this.controller = new MiningController(this.createService());
    }

    return this.controller;
  }

  static createService() {
    if (!this.service) {
      this.service = new MiningService();
    }

    return this.service;
  }
}
