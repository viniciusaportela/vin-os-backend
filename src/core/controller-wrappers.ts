import { Request, Response } from "express";
import { IController } from "./controller-decorators";

interface IRequestMeta {
  body: any;
  request?: Request;
  response?: Response;
  ws?: WebSocket;
}

export function httpWrapper(fn: Function, controller: IController) {
  return async (req: Request, res: Response) => {
    const meta = {
      body: req.body,
      request: req,
      response: res,
    };

    try {
      const result = await fn.bind(controller)(
        ...processParams(fn, controller, meta)
      );
      res.json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "internal-server-error" });
    }
  };
}

export function wssWrapper(fn: Function, controller: IController) {
  return async (message: any, ws: WebSocket) => {
    const meta = {
      body: message,
      ws,
    };

    try {
      await fn.bind(controller)(...processParams(fn, controller, meta));
    } catch (e) {
      console.error(e);
    }
  };
}

function processParams(
  fn: Function,
  controller: IController,
  meta: IRequestMeta
) {
  const parameters =
    Reflect.getMetadata("parameters", controller, fn.name) ?? [];

  const paramValues: any[] = [];
  for (const parameter of parameters) {
    paramValues.push(processParamByType(parameter, meta));
  }

  return paramValues;
}

function processParamByType(type: string, meta: IRequestMeta) {
  switch (type) {
    case "body":
      return meta.body;
    case "request":
      return meta.request;
    case "response":
      return meta.response;
    case "ws":
      return meta.ws;
    case "query":
      return meta.request?.query;
  }
}
