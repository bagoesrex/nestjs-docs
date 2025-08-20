## Providers

Providers are a core concept in Nest. Many of the basic Nest classes, such as services, repositories, factories, and helpers, can be treated as providers. The key idea behind a provider is that it can be injected as a dependency, allowing objects to form various relationships with each other. The responsibility of "wiring up" these objects is largely handled by the Nest runtime system.

![Provider Image](./docs/images/provider.png)

In the previous chapter, we created a simple `KeonksController`. Controllers should handle HTTP requests and delegate more complex tasks to providers. Providers are plain JavaScript classes declared as `providers` in a NestJS module. For more details, refer to the "Modules" chapter.

> **Hint**
> Since Nest enables you to design and organize dependencies in an object-oriented manner, we strongly recommend following the **SOLID principles**.
