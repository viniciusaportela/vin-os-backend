import {
  Body,
  Controller,
  HttpRoute,
  Query,
  WssRoute,
} from "../../core/controller-decorators";
import {
  IGetPlayer,
  IGiveCoins,
  IRegister,
  ITransferCoins,
} from "./players.interface";
import { PlayersService } from "./players.service";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @WssRoute("register")
  register(@Body() body: IRegister) {
    return this.playersService.register(body);
  }

  @WssRoute("giveCoins")
  giveCoins(@Body() body: IGiveCoins) {
    return this.playersService.giveCoins(body);
  }

  @HttpRoute("GET", "get")
  getPlayer(@Query() body: IGetPlayer) {
    return this.playersService.getPlayer(body);
  }

  @HttpRoute("POST", "transferCoins")
  transferCoins(@Body() body: ITransferCoins) {
    return this.playersService.transferCoins(body);
  }
}
