import { Body, Controller, WssRoute } from "../../core/controller-decorators";
import { IRegister } from "./computers.interface";
import { ComputersService } from "./computers.service";

@Controller("computers")
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  @WssRoute("register")
  register(@Body() body: IRegister) {
    return this.computersService.register(body);
  }
}
