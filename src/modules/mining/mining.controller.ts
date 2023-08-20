import { Body, Controller, WssRoute } from "../../core/controller-decorators";
import { IMine } from "./mining.interface";
import { MiningService } from "./mining.service";

@Controller("mining")
export class MiningController {
  constructor(private readonly miningService: MiningService) {}

  @WssRoute("mine")
  mine(@Body() body: IMine) {
    return this.miningService.mine(body);
  }
}
