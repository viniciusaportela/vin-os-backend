import {
  Body,
  Controller,
  HttpRoute,
  Query,
  WssRoute,
} from "../../core/controller-decorators";
import { IListProcessedBlocksWithPlayer, IMine } from "./mining.interface";
import { MiningService } from "./mining.service";

@Controller("mining")
export class MiningController {
  constructor(private readonly miningService: MiningService) {}

  @WssRoute("mine")
  mine(@Body() body: IMine) {
    return this.miningService.mine(body);
  }

  @HttpRoute("GET", "listProcessedBlocksWithPlayer")
  listProcessedBlocksWithPlayer(@Query() body: IListProcessedBlocksWithPlayer) {
    return this.miningService.listProcessedBlocksWithPlayer(body);
  }

  @HttpRoute("GET", "listProcessedBlocks")
  listProcessedBlocks() {
    return this.miningService.listProcessedBlocks();
  }
}
