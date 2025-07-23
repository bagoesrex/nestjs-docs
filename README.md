## Controllers

![Controller Image](./docs/images/controller.png)

Controllers are responsible for handling **incoming requests** and **sending responses** back to the client.

> **Hint**
> To quickly create a CRUD controller with built-in validation, you can use the CLI's CRUD generator `nest g resource [name]`.

## Routing

To create a basic controller, we use the @Controller() decorator.
You can add a route prefix like `@Controller('keonk')` to group related endpoints `(/keonk)`.

```ts
keonk.controller.ts;

import { Controller, Get } from '@nestjs/common';

@Controller('keonk')
export class KeonkController {
  @Get()
  findAll(): string {
    return 'Keonk response';
  }
}
```

> **Hint**
> To create a controller using the CLI, simply execute the `nest g controller [name]`.

## Request Object

Handlers often need access to the client’s **request** details. Nest provides access to the **request object** from the underlying platform (Express by default). You can access the request object by instructing Nest to inject it using the `@Req()` decorator in the handler’s signature.

```ts
keonk.controller.ts;

import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('keonk')
export class KeonkController {
  @Get()
  findAll(@Req() request: Request): string {
    console.log(request.method);
    console.log(request.url);
    console.log(request.headers);
    return 'Keonk response';
  }
}
```

> **Hint**
> To take advantage of **express** typings (like in the **request: Request** parameter example above), make sure to install the **@types/express** package.

The request object represents the HTTP request and contains properties for the query string, parameters, HTTP headers, and body. In most cases, you don't need to manually access these properties. Instead, you can use dedicated decorators like **@Body()** or **@Query()**, which are available out of the box. Below is a list of the provided decorators and the corresponding platform-specific objects they represent.

| Decorator                 | Value                               |
| ------------------------- | ----------------------------------- |
| `@Request()`, `@Req()`    | `req`                               |
| `@Response()`, `@Res()`\* | `res`                               |
| `@Next()`                 | `next`                              |
| `@Session()`              | `req.session`                       |
| `@Param(key?: string)`    | `req.params` / `req.params[key]`    |
| `@Body(key?: string)`     | `req.body` / `req.body[key]`        |
| `@Query(key?: string)`    | `req.query` / `req.query[key]`      |
| `@Headers(name?: string)` | `req.headers` / `req.headers[name]` |
| `@Ip()`                   | `req.ip`                            |
| `@HostParam()`            | `req.hosts`                         |
