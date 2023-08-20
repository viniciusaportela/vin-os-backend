import { Body, Controller, WssRoute } from "../../core/controller-decorators";
import { IRegister } from "./players.interface";
import { PlayersService } from "./players.service";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @WssRoute("register")
  register(@Body() body: IRegister) {
    return this.playersService.register(body);
  }
}
