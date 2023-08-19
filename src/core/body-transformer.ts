import { Request } from "express";

export class BodyTransformer {
  constructor(private readonly body: any) {}

  transformWs(message: any) {}

  transformHttp(req: Request) {}
}
