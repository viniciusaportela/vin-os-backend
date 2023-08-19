import {
  Body,
  Controller,
  HttpRoute,
  WssRoute,
} from "../../core/controller-decorators";
import { MiningService } from "./mining.service";

@Controller("/mining")
export class MiningController {
  constructor(private readonly miningService: MiningService) {}

  @WssRoute("mine")
  mine(@Body() body: any) {
    return this.miningService.mine(body);
  }

  @HttpRoute("GET", "/status")
  getStatus() {
    return this.miningService.getStatus();
  }
}
