import {
  Body,
  Controller,
  HttpRoute,
  Query,
  WssRoute,
} from "../../core/controller-decorators";
import { IListFromPlayer, IRegister } from "./computers.interface";
import { ComputersService } from "./computers.service";

@Controller("computers")
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @WssRoute("register")
  register(@Body() body: IRegister) {
    return this.computersService.register(body);
  }

  @HttpRoute("GET", "listComputersFromPlayer")
  listComputersFromPlayer(@Query() body: IListFromPlayer) {
    return this.computersService.listComputersFromPlayer(body);
  }
}
