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
> Import `HttpCode` from the` @nestjs/common` package.

## Response headers

To specify a custom response header, you can either use a `@Header()` decorator or a library-specific response object (and call `res.header()` directly).

```ts
  @Post()
  @Header('Cache-Control', 'no-store')
  create(): string {
      return 'Membuat keonk baru';
  }
```

> **Hint**
> Import `Header` from the` @nestjs/common package`.

## Redirection

To redirect a response to a specific URL, you can either use a `@Redirect()` decorator or a library-specific response object (and call `res.redirect()` directly).

`@Redirect()` takes two arguments, `url` and `statusCode`, both are optional. The default value of `statusCode` is `302` (`Found`) if omitted.

```ts
  @Get('portfolio')
  @Redirect('https://bagoes.dev', 301)
  redirectPortfolio(): void { }
```

> **Hint**
> Sometimes you may want to determine the HTTP status code or the redirect URL dynamically. Do this by returning an object following the `HttpRedirectResponse` interface (from `@nestjs/common`).

Returned values will override any arguments passed to the `@Redirect()` decorator. For example:

```ts
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
     return { url: 'https://docs.nestjs.com/v5' };
    }
  }

```

## Route parameters

Routes with static paths won’t work when you need to accept dynamic data as part of the request (e.g., `GET /keonk/1` to get the cat with id `1`). To define routes with parameters, you can add route parameter **tokens** in the route path to capture the dynamic values from the URL. The route parameter token in the `@Get()` decorator example below illustrates this approach. These route parameters can then be accessed using the `@Param()` decorator, which should be added to the method signature.

> **Hint**
> Routes with parameters should be declared after any static paths. This prevents the parameterized paths from intercepting traffic destined for the static paths.

```ts
  @Get(':id')
  findOne(@Param() params: any): string {
    console.log(params.id);
    return `This action returns a #${params.id} keonk`;
  }
```

The `@Param()` decorator is used to decorate a method parameter (in the example above, `params`), making the route parameters accessible as properties of that decorated method parameter inside the method. As shown in the code, you can access the `id` parameter by referencing `params.id`. Alternatively, you can pass a specific parameter token to the decorator and directly reference the route parameter by name within the method body.

> **Hint**
> Import `Param` from the `@nestjs/common` package.

```ts
  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} keonk`;
  }
```

## Sub-domain routing

The `@Controller` decorator can take a host option to require that the HTTP host of the incoming requests matches some specific value.

```ts
@Controller({ host: 'etmin.example.com' })
export class KeonkController {
  @Get()
  index(): string {
    return 'Keonk akan merespon jika host berasal dari etmin.example.com';
  }
}
```

Similar to a route `path`, the `host` option can use tokens to capture the dynamic value at that position in the host name. The host parameter token in the `@Controller()` decorator example below demonstrates this usage. Host parameters declared in this way can be accessed using the `@HostParam()` decorator, which should be added to the method signature.

```ts
@Controller({ host: ':account.example.com' })
export class KeonkController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```

## State Sharing

For developers coming from other programming languages, it might be surprising to learn that in Nest, nearly everything is `shared across incoming requests`. This includes resources like the database connection pool, `singleton services` with global state, and more. It's important to understand that Node.js doesn't use the request/response `Multi-Threaded Stateless Model`, where each request is handled by a separate thread. As a result, using singleton instances in Nest is completely safe for our applications.

That said, there are specific edge cases where having request-based lifetimes for controllers may be necessary. Examples include per-request caching in GraphQL applications, request tracking, or implementing multi-tenancy.

## Asynchronicity

We love modern JavaScript, especially its emphasis on **asynchronous** data handling. That’s why Nest fully supports `async` functions. Every `async` function must return a `Promise`, which allows you to return a deferred value that Nest can resolve automatically. Here's an example:

```ts
keonk.controller.ts;

  @Get()
  async findAll(): Promise<any[]> {
      return [];
  }
```

This code is perfectly valid. But Nest takes it a step further by allowing route handlers to return RxJS **observable streams** as well. Nest will handle the subscription internally and resolve the final emitted value once the stream completes.

```ts
keonk.controller.ts;

  @Get()
  async findAll(): Observable<any[]> {
      return of([]);
  }
```

Both approaches are valid, and you can choose the one that best suits your needs.

## Request Payloads

In our previous example, the POST route handler didn’t accept any client parameters. Let's fix that by adding the `@Body()` decorator.

Before we proceed (if you're using TypeScript), we need to define the **DTO** (Data Transfer Object) schema. A DTO is an object that specifies how data should be sent over the network. We could define the DTO schema using **TypeScript** interfaces or simple classes. However, we recommend using classes here. Why? **Classes** are part of the JavaScript ES6 standard, so they remain intact as real entities in the compiled JavaScript. In contrast, TypeScript interfaces are removed during transpilation, meaning Nest can't reference them at runtime. This is important because features like **Pipes** rely on having access to the metatype of variables at runtime, which is only possible with classes.

Let's create the `CreateKeonkDto` class:

```ts
create_keonk.dto.ts;

export class CreateKeonkDto {
  name: string;
  age: number;
  breed: string;
}
```

It has only three basic properties. Thereafter we can use the newly created DTO inside the `KeonkController`:

```ts
keonk.controller.ts;

    @Post()
    async create(@Body() createKeonkDto: CreateKeonkDto) {
        return 'This action membuat keonk baru';
    }
```

> **Hint**
> Our `ValidationPipe` can filter out properties that should not be received by the method handler. In this case, we can whitelist the acceptable properties, and any property not included in the whitelist is automatically stripped from the resulting object. In the `CreateKeonkDto` example, our whitelist is the `name`, `age`, and `breed` properties.

## Query parameters

When handling query parameters in your routes, you can use the `@Query()` decorator to extract them from incoming requests. Let's see how this works in practice.

Consider a route where we want to filter a list of keonks based on query parameters like `age` and `breed`. First, define the query parameters in the KeonkController:

```ts
keonk.controller.ts;

  @Get()
  async findAll(@Query('age') age: number, @Query('breed') breed: string) {
      return `This action returns all keonks filtered by age: ${age} and breed: ${breed}`;
  }
```

In this example, the `@Query()` decorator is used to extract the values of `age` and `breed` from the query string. For example, a request to:

```http
GET /cats?age=3&breed=Jawanese
```

would result in age being 3 and breed being Jawanese.
If your application requires handling more complex query parameters, such as nested objects or arrays:

```http
?filter[where][name]=John&filter[where][age]=30
?item[]=1&item[]=2
```

you'll need to configure your HTTP adapter (Express or Fastify) to use an appropriate query parser. In Express, you can use the `extended` parser, which allows for rich query objects:

```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set('query parser', 'extended');
```

In Fastify, you can use the `querystringParser` option:

```ts
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({
    querystringParser: (str) => qs.parse(str),
  }),
);
```

> **Hint**
> `qs` is a querystring parser that supports nesting and arrays. You can install it using `npm install qs`.

## Full resource sample

Below is an example that demonstrates the use of several available decorators to create a basic controller. This controller provides a few methods to access and manipulate internal data.

```ts
keonks.controller.ts;

import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateKeonkDto, UpdateKeonkDto, ListAllEntities } from './dto';

@Controller('keonks')
export class KeonksController {
  @Post()
  create(@Body() createKeonkDto: CreateKeonkDto) {
    return 'This action membuat keonk baru';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action menampilkan semua keonks (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action menghasilkan keonk #${id}`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateKeonkDto: UpdateKeonkDto) {
    return `This action memperbarui keonk dengan id #${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action mengapus keonk dengan id #${id}`;
  }
}
```

> **Hint**
> Nest CLI offers a generator (schematic) that automatically creates **all the boilerplate code**, saving you from doing this manually and improving the overall developer experience.

## Getting up and running

Even with the `KeonksController` fully defined, Nest doesn't yet know about it and won't automatically create an instance of the class.

Controllers must always be part of a module, which is why we include the `controllers` array within the `@Module()` decorator. Since we haven’t defined any other modules apart from the root `AppModule`, we’ll use it to register the `KeonksController`:

```ts
app.module.ts;

import { Module } from '@nestjs/common';
import { KeonksController } from './keonks/.controller';

@Module({
  controllers: [KeonksController],
})
export class AppModule {}
```

We attached the metadata to the module class using the `@Module()` decorator, and now Nest can easily determine which controllers need to be mounted.

## Library-specific approach

So far, we've covered the standard Nest way of manipulating responses. Another approach is to use a library-specific response object. To inject a specific response object, we can use the `@Res()` decorator. To highlight the differences, let’s rewrite the `KeonksController` like this:

```ts
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('keonks')
export class KeonksController {
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }
}
```

While this approach works and offers more flexibility by giving full control over the response object (such as header manipulation and access to library-specific features), it should be used with caution. Generally, this method is less clear and comes with some downsides. The main disadvantage is that your code becomes platform-dependent, as different underlying libraries may have different APIs for the response object. Additionally, it can make testing more challenging, as you'll need to mock the response object, among other things.

Furthermore, by using this approach, you lose compatibility with Nest features that rely on standard response handling, such as Interceptors and the `@HttpCode()` / `@Header()` decorators. To address this, you can enable the `passthrough` option like this:

```ts
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.status(HttpStatus.OK);
  return [];
}
```

With this approach, you can interact with the native response object (for example, setting cookies or headers based on specific conditions), while still allowing the framework to handle the rest.
