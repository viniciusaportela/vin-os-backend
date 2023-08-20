import { ComputersController } from "./computers.controller";
import { ComputersService } from "./computers.service";

export class ComputersFactory {
  static controller: ComputersController;
  static service: ComputersService;

  static createController() {
    if (!this.controller) {
      this.controller = new ComputersController(this.createService());
    }

    return this.controller;
  }

  static createService() {
    if (!this.service) {
      this.service = new ComputersService();
    }

    return this.service;
  }
}
