import {
  Body,
  Controller,
  HttpRoute,
  WssRoute,
} from "../../core/controller-decorators";
import { IMine } from "./mining.interface";
import { MiningService } from "./mining.service";

@Controller("mining")
export class MiningController {
  constructor(private readonly miningService: MiningService) {}

  @WssRoute("mine")
  mine(@Body() body: IMine) {
    return this.miningService.mine(body);
  }

  @HttpRoute("GET", "status")
  getStatus() {
    return this.miningService.getStatus();
  }

  // TODO Add Miner View (get all data relevant to miner)
}
