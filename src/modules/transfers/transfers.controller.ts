import { Controller, HttpRoute, Query } from "../../core/controller-decorators";
import { IListFromPlayer } from "./transfers.interface";
import { TransfersService } from "./transfers.service";

@Controller("transfers")
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @HttpRoute("GET", "listFromPlayer")
  listFromPlayer(@Query() body: IListFromPlayer) {
    return this.transfersService.listFromPlayer(body);
  }
}
