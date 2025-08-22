## Providers

Providers are a core concept in Nest. Many of the basic Nest classes, such as services, repositories, factories, and helpers, can be treated as providers. The key idea behind a provider is that it can be injected as a dependency, allowing objects to form various relationships with each other. The responsibility of "wiring up" these objects is largely handled by the Nest runtime system.

![Provider Image](./docs/images/provider.png)

In the previous chapter, we created a simple `KeonksController`. Controllers should handle HTTP requests and delegate more complex tasks to providers. Providers are plain JavaScript classes declared as `providers` in a NestJS module. For more details, refer to the "Modules" chapter.

> **Hint**
> Since Nest enables you to design and organize dependencies in an object-oriented manner, we strongly recommend following the **SOLID principles**.

## Services

Let's begin by creating a simple `KeonksService`. This service will handle data storage and retrieval, and it will be used by the `KeonksController`. Because of its role in managing the application's logic, it’s an ideal candidate to be defined as a provider.

```ts
keonks.service.ts;

import { Injectable } from '@nestjs/common';
import { Keonk } from 'src/interfaces/keonk.interface';

@Injectable()
export class KeonksService {
  private readonly keonks: Keonk[] = [];

  create(keonk: Keonk) {
    this.keonks.push(keonk);
  }

  findAll(): Keonk[] {
    return this.keonks;
  }
}
```

> **Hint**
> To create a service using the CLI, simply execute the `$ nest g service keonks` command.

Our KeonksService is a basic class with one property and two methods. The key addition here is the `@Injectable()` decorator. This decorator attaches metadata to the class, signaling that `KeonksService` is a class that can be managed by the Nest IoC container.

Additionally, this example makes use of a Keonk interface, which likely looks something like this:

```ts
interfaces / keonk.interface.ts;

import { Injectable } from '@nestjs/common';
import { Keonk } from 'src/interfaces/keonk.interface';

@Injectable()
export class KeonksService {
  private readonly keonks: Keonk[] = [];

  create(keonk: Keonk) {
    this.keonks.push(keonk);
  }

  findAll(): Keonk[] {
    return this.keonks;
  }
}
```

Now that we have a service class to retrieve keonks, let's use it inside the `KeonksController`:

```ts
interfaces / keonk.interface.ts;

import { Injectable } from '@nestjs/common';
import { Keonk } from 'src/interfaces/keonk.interface';

@Injectable()
export class KeonksService {
  private readonly keonks: Keonk[] = [];

  create(keonk: Keonk) {
    this.keonks.push(keonk);
  }

  findAll(): Keonk[] {
    return this.keonks;
  }
}
```

Now that we have a service class to retrieve keonks, let's use it inside the `KeonksController`:

```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { KeonksService } from './keonks.service';
import { CreateKeonkDto } from './create-keonk.dto';
import { Keonk } from 'src/interfaces/keonk.interface';

@Controller('keonks')
export class KeonksController {
  constructor(private keonksService: KeonksService) {}

  @Post()
  async create(@Body() createKeonkDto: CreateKeonkDto) {
    this.keonksService.create(createKeonkDto);
  }

  @Get()
  async findAll(): Promise<Keonk[]> {
    return this.keonksService.findAll();
  }
}
```

The `KeonksService` is injected through the class constructor. Notice the use of the `private` keyword. This shorthand allows us to both declare and initialize the `keonksService` member in the same line, streamlining the process.

## Dependency injection

Nest is built around the powerful design pattern known as **Dependency Injection**. We highly recommend reading a great article about this concept in the official [Angular documentation](https://angular.dev/guide/di).

In Nest, thanks to TypeScript's capabilities, managing dependencies is straightforward because they are resolved based on their type. In the example below, Nest will resolve the `keonksService` by creating and returning an instance of `KeonksService` (or, in the case of a singleton, returning the existing instance if it has already been requested elsewhere). This dependency is then injected into your controller's constructor (or assigned to the specified property):

```ts

constructor(private keonksService: KeonksService) {}

```

## Scopes

Providers typically have a lifetime ("scope") that aligns with the application lifecycle. When the application is bootstrapped, each dependency must be resolved, meaning every provider gets instantiated. Similarly, when the application shuts down, all providers are destroyed. However, it’s also possible to make a provider **request-scoped**, meaning its lifetime is tied to a specific request rather than the application's lifecycle. You can learn more about these techniques in the [Injection Scopes](https://docs.nestjs.com/fundamentals/injection-scopes) chapter.
