## Middleware

Middleware is a function which is called **before** the route handler. Middleware functions have access to the **request** and **response** objects, and the `next()` middleware function in the application’s request-response cycle. The **next** middleware function is commonly denoted by a variable named `next`.

![Middleware Image](./docs/images/middleware.png)

Nest middleware are, by default, equivalent to **express** middleware. The following description from the official express documentation describes the capabilities of middleware:

> Middleware functions can perform the following tasks:
>
> - execute any code.
> - make changes to the request and the response objects.
> - end the request-response cycle.
> - call the next middleware function in the stack.
> - if the current middleware function does not end the request-response cycle, it must call `next()` to pass control to the next middleware function. Otherwise, the request will be left hanging.

You implement custom Nest middleware in either a function, or in a class with an `@Injectable()` decorator. The class should implement the `NestMiddleware` interface, while the function does not have any special requirements. Let's start by implementing a simple middleware feature using the class method.

> **Warning**
> `Express` and `fastify` handle middleware differently and provide different method signatures.

```ts
logger.middleware.ts;

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

## Dependency injection

Nest middleware fully supports Dependency Injection. Just as with providers and controllers, they are able to inject dependencies that are available within the same module. As usual, this is done through the `constructor`.

## Applying middleware

There is no place for middleware in the `@Module()` decorator. Instead, we set them up using the `configure()` method of the module class. Modules that include middleware have to implement the `NestModule` interface. Let's set up the `LoggerMiddleware` at the `AppModule` level.

```ts
app.module.ts;

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { KeonksModule } from './keonks/keonks.module';

@Module({
  imports: [KeonksModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('keonks');
  }
}
```

In the above example we have set up the `LoggerMiddleware` for the `/keonks` route handlers that were previously defined inside the `KeonksController`. We may also further restrict a middleware to a particular request method by passing an object containing the route `path` and request `method` to the `forRoutes()` method when configuring the middleware. In the example below, notice that we import the `RequestMethod` enum to reference the desired request method type.

```ts
app.module.ts;

import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { KeonksModule } from './keonks/keonks.module';

@Module({
  imports: [KeonksModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'keonks', method: RequestMethod.GET });
  }
}
```

> **Hint**
> The `configure()` method can be made asynchronous using `async/await` (e.g., you can `await` completion of an asynchronous operation inside the `configure()` method body).

> **Warning**
> When using the `express` adapter, the NestJS app will register `json` and `urlencoded` from the package `body-parser` by default. This means if you want to customize that middleware via the `MiddlewareConsumer`, you need to turn off the global middleware by setting the `bodyParser` flag to `false` when creating the application with `NestFactory.create()`.

## Route wildcards

Pattern-based routes are also supported in NestJS middleware. For example, the named wildcard (`*splat`) can be used as a wildcard to match any combination of characters in a route. In the following example, the middleware will be executed for any route that starts with `abcd/`, regardless of the number of characters that follow.

```ts
forRoutes({
  path: 'abcd/*splat',
  method: RequestMethod.ALL,
});
```

> **Hint**
> `splat` is simply the name of the wildcard parameter and has no special meaning. You can name it anything you like, for example, `*wildcard`.

The `'abcd/*'` route path will match `abcd/1`, `abcd/123`, `abcd/abc`, and so on. The hyphen (`-`) and the dot (`.`) are interpreted literally by string-based paths. However, `abcd/` with no additional characters will not match the route. For this, you need to wrap the wildcard in braces to make it optional:

```ts
forRoutes({
  path: 'abcd/{*splat}',
  method: RequestMethod.ALL,
});
```

## Middleware consumer

The `MiddlewareConsumer` is a helper class. It provides several built-in methods to manage middleware. All of them can be simply **chained** in the **fluent style**. The `forRoutes()` method can take a single string, multiple strings, a `RouteInfo` object, a controller class and even multiple controller classes. In most cases you'll probably just pass a list of controllers separated by commas. Below is an example with a single controller:

```ts
app.module.ts;

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { KeonksModule } from './keonks/keonks.module';
import { KeonksController } from './keonks/keonks.controller';

@Module({
  imports: [KeonksModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(KeonksController);
  }
}
```

> **Hint**
> The `apply()` method may either take a single middleware, or multiple arguments to specify [multiple middlewares](https://docs.nestjs.com/middleware#multiple-middleware).

## Excluding routes

At times, we may want to exclude certain routes from having middleware applied. This can be easily achieved using the `exclude()` method. The `exclude()` method accepts a single string, multiple strings, or a `RouteInfo` object to identify the routes to be excluded.

Here's an example of how to use it:

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'keonks', method: RequestMethod.GET },
    { path: 'keonks', method: RequestMethod.POST },
    'keonks/{*splat}',
  )
  .forRoutes(KeonksController);
```

> **Hint**
> The `exclude()` method supports wildcard parameters using the [path-to-regexp](https://github.com/pillarjs/path-to-regexp#parameters) package.

With the example above, `LoggerMiddleware` will be bound to all routes defined inside `KeonksController` **except** the three passed to the `exclude()` method.

This approach provides flexibility in applying or excluding middleware based on specific routes or route patterns.

## Functional middleware

The `LoggerMiddleware` class we've been using is quite simple. It has no members, no additional methods, and no dependencies. Why can't we just define it in a simple function instead of a class? In fact, we can. This type of middleware is called **functional middleware**. Let's transform the logger middleware from class-based into functional middleware to illustrate the difference:

```ts
logger.middleware.ts;

import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

And use it within the AppModule:

```ts
app.module.ts;

consumer.apply(logger).forRoutes(KeonksController);
```

> **Hint**
> Consider using the simpler **functional middleware** alternative any time your middleware doesn't need any dependencies.
