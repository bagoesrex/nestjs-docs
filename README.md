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

## Resources

Earlier, we defined an endpoint to fetch the keonk resource (GET route). We'll typically also want to provide an endpoint that creates new records. For this, let's create the POST, PUT, DELETE handler:

```ts
keonk.controller.ts;

import { Controller, Get, Post, Put, Delete, Req, Param } from '@nestjs/common';
import { Request } from 'express';

@Controller('keonk')
export class KeonkController {
  @Post()
  create(): string {
    return 'Membuat keonk baru';
  }

  @Put(':id')
  update(@Param('id') id: string): string {
    return `Keonk dengan ID ${id} telah diperbarui`;
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return `Keonk dengan ID ${id} telah dihapus`;
  }

  @Get()
  findAll(@Req() request: Request): string {
    console.log(request.method);
    console.log(request.url);
    console.log(request.headers);
    return 'Keonk response';
  }
}
```

It's that simple. Nest provides decorators for all of the standard HTTP methods: `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`, `@Options()`, and `@Head()`. In addition, `@All()` defines an endpoint that handles all of them.

## Route wildcards

Pattern-based routes are also supported in NestJS. For example, the asterisk (`*`) can be used as a wildcard to match any combination of characters in a route at the end of a path. In the following example, the `handleWildcard()` method will be executed for any route that starts with `abcd/`, regardless of the number of characters that follow.

```ts
  @Get('abcd/*')
  handleWildcard(): string {
    return 'When Get abcd/keonk abcd/meonk abcd/miaw or abcd/* anythings';
  }
```

## Status code

As mentioned, the default status code for responses is always 200, except for POST requests, which default to 201. You can easily change this behavior by using the `@HttpCode(...)` decorator at the handler level.

```ts
  @Post()
  @HttpCode(202)
  create(): string {
      return 'Membuat keonk baru';
  }
```

> **Hint**
> Import ``HttpCode`` from the`` @nestjs/common`` package.
