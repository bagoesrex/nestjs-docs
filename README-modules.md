## Modules

A module is a class that is annotated with the `@Module()` decorator. This decorator provides metadata that **Nest** uses to organize and manage the application structure efficiently.

![Modules Image](./docs/images/modules.png)

Every Nest application has at least one module, the **root module**, which serves as the starting point for Nest to build the **application graph**. This graph is an internal structure that Nest uses to resolve relationships and dependencies between modules and providers. While small applications might only have a root module, this is generally not the case. Modules are **highly recommended** as an effective way to organize your components. For most applications, you'll likely have multiple modules, each encapsulating a closely related set of **capabilities**.

The `@Module()` decorator takes a single object with properties that describe the module:

| Property        | Description                                                                                                                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **providers**   | the providers that will be instantiated by the Nest injector and may be shared at least across this module                                                                                               |
| **controllers** | the set of controllers defined in this module which have to be instantiated                                                                                                                              |
| **imports**     | the list of imported modules that export the providers which are required in this module                                                                                                                 |
| **exports**     | the subset of `providers` that are provided by this module and should be available in other modules which import this module. You can use either the provider itself or just its token (`provide` value) |

The module **encapsulates** providers by default, meaning you can only inject providers that are either part of the current module or explicitly exported from other imported modules. The exported providers from a module essentially serve as the module's public interface or API.

## Feature modules

In our example, the `KeonksController` and `KeonksService` are closely related and serve the same application domain. It makes sense to group them into a feature module. A feature module organizes code that is relevant to a specific feature, helping to maintain clear boundaries and better organization. This is particularly important as the application or team grows, and it aligns with the **SOLID** principles.

Next, we'll create the **KeonksModule** to demonstrate how to group the controller and service.

```ts
keonks / keonks.module.ts;

import { Module } from '@nestjs/common';
import { KeonksController } from './keonks.controller';
import { KeonksService } from './keonks.service';

@Module({
  controllers: [KeonksController],
  providers: [KeonksService],
})
export class KeonksModule {}
```

> **Hint**
> To create a module using the CLI, simply execute the `$ nest g module keonks` command.

Above, we defined the `KeonksModule` in the `keonks.module.ts` file, and moved everything related to this module into the `keonks` directory. The last thing we need to do is import this module into the root module (the `AppModule`, defined in the `app.module.ts` file).

```ts
app.module.ts;

import { Module } from '@nestjs/common';
import { KeonksModule } from './keonks/keonks.module';

@Module({
  imports: [KeonksModule],
})
export class AppModule {}
```

Here is how our directory structure looks now:

![Modules-feature Image](./docs/images/modules-feature.png)

## Shared modules

In Nest, modules are **singletons** by default, and thus you can share the same instance of any provider between multiple modules effortlessly.

![Modules-v Image](./docs/images/modules-shared.png)

Every module is automatically a **shared module**. Once created it can be reused by any module. Let's imagine that we want to share an instance of the `KeonksService` between several other modules. In order to do that, we first need to **export** the `KeonksService` provider by adding it to the module's `exports` array, as shown below:

```ts
keonks.module.ts;

import { Module } from '@nestjs/common';
import { KeonksController } from './keonks.controller';
import { KeonksService } from './keonks.service';

@Module({
  controllers: [KeonksController],
  providers: [KeonksService],
  exports: [KeonksService],
})
export class KeonksModule {}
```

Now any module that imports the `KeonksModule` has access to the `KeonksService` and will share the same instance with all other modules that import it as well.

If we were to directly register the `KeonksService` in every module that requires it, it would indeed work, but it would result in each module getting its own separate instance of the `KeonksService`. This can lead to increased memory usage since multiple instances of the same service are created, and it could also cause unexpected behavior, such as state inconsistency if the service maintains any internal state.

By encapsulating the `KeonksService` inside a module, such as the `KeonksModule`, and exporting it, we ensure that the same instance of `KeonksService` is reused across all modules that import `KeonksModule`. This not only reduces memory consumption but also leads to more predictable behavior, as all modules share the same instance, making it easier to manage shared states or resources. This is one of the key benefits of modularity and dependency injection in frameworks like NestJS—allowing services to be efficiently shared throughout the application.

## Module re-exporting

As seen above, Modules can export their internal providers. In addition, they can re-export modules that they import. In the example below, the `CommonModule` is both imported into and exported from the `CoreModule`, making it available for other modules which import this one.

```ts
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

## Dependency injection

A module class can **inject** providers as well (e.g., for configuration purposes):

```ts
keonks.module.ts;

import { Module } from '@nestjs/common';
import { KeonksController } from './keonks.controller';
import { KeonksService } from './keonks.service';

@Module({
  controllers: [KeonksController],
  providers: [KeonksService],
})
export class KeonksModule {
  constructor(private keonksService: KeonksService) {}
}
```

However, module classes themselves cannot be injected as providers due to [circular dependency](https://docs.nestjs.com/fundamentals/circular-dependency).

## Global modules

If you have to import the same set of modules everywhere, it can get tedious. Unlike in Nest, **Angular** `providers` are registered in the global scope. Once defined, they're available everywhere. Nest, however, encapsulates providers inside the module scope. You aren't able to use a module's providers elsewhere without first importing the encapsulating module.

When you want to provide a set of providers which should be available everywhere out-of-the-box (e.g., helpers, database connections, etc.), make the module global with the `@Global()` decorator.

```ts
import { Module, Global } from '@nestjs/common';
import { KeonksController } from './keonks.controller';
import { KeonksService } from './keonks.service';

@Global()
@Module({
  controllers: [KeonksController],
  providers: [KeonksService],
  exports: [KeonksService],
})
export class KeonksModule {}
```

The `@Global()` decorator makes the module global-scoped. Global modules should be registered only once, generally by the root or core module. In the above example, the `KeonksService` provider will be ubiquitous, and modules that wish to inject the service will not need to import the `KeonksModule` in their imports array.

> **Hint**
> Making everything global is not recommended as a design practice. While global modules can help reduce boilerplate, it's generally better to use the `imports` array to make a module's API available to other modules in a controlled and clear way. This approach provides better structure and maintainability, ensuring that only the necessary parts of the module are shared with others while avoiding unnecessary coupling between unrelated parts of the application.
