export interface IHttpRouteMeta {
  method: "GET" | "POST";
  route: string;
  function: Function;
}

export interface IWebsocketRouteMeta {
  command: string;
  function: Function;
}

export interface IController {
  httpRoutes: IHttpRouteMeta[];
  websocketRoutes: IWebsocketRouteMeta[];
}

export function Controller(path: string): ClassDecorator {
  return function (constructor: any) {
    const originalPrototype = constructor.prototype;

    function newConstructor(...args: any[]) {
      const instance = new constructor(...args);

      const httpRoutes: IHttpRouteMeta[] = [];
      const websocketRoutes: IWebsocketRouteMeta[] = [];

      for (const methodName of Object.getOwnPropertyNames(
        instance.constructor.prototype
      )) {
        if (methodName === "constructor") continue;

        const httpPath = Reflect.getMetadata(
          "httpRoute",
          originalPrototype,
          methodName
        );
        if (httpPath) {
          httpRoutes.push({
            method: httpPath.method,
            route: `/${path}/${httpPath.route}`,
            function: instance[methodName],
          });
        }

        const websocketRoute = Reflect.getMetadata(
          "wssRoute",
          originalPrototype,
          methodName
        );
        if (websocketRoute) {
          websocketRoutes.push({
            command: `${path}::${websocketRoute}`,
            function: instance[methodName],
          });
        }

        instance.httpRoutes = httpRoutes;
        instance.websocketRoutes = websocketRoutes;
      }

      return instance;
    }

    newConstructor.prototype = originalPrototype;

    return newConstructor as any;
  };
}

export function HttpRoute(method: "GET" | "POST", route: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("httpRoute", { method, route }, target, propertyKey);
  };
}

export function WssRoute(command: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("wssRoute", command, target, propertyKey);
  };
}

export function Body() {
  return function (target: any, propertyKey: any, parameterIndex: number) {
    registerParameter("body", target, propertyKey, parameterIndex);
  };
}

export function Query() {
  return function (target: any, propertyKey: any, parameterIndex: number) {
    registerParameter("query", target, propertyKey, parameterIndex);
  };
}

export function Response() {
  return function (target: any, propertyKey: any, parameterIndex: number) {
    registerParameter("response", target, propertyKey, parameterIndex);
  };
}

function registerParameter(
  parameter: string,
  target: any,
  propertyKey: any,
  parameterIndex: number
) {
  const parameters =
    Reflect.getMetadata("parameters", target, propertyKey) ?? [];

  parameters[parameterIndex] = parameter;

  Reflect.defineMetadata("parameters", parameters, target, propertyKey);
}
