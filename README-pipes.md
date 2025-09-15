## Pipes

A pipe is a class annotated with the `@Injectable()` decorator, which implements the `PipeTransform` interface.

![Pipes Image](./docs/images/pipes.png)

Pipes have two typical use cases:

- **transformation:** transform input data to the desired form (e.g., from string to integer)

- **validation:** evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception

In both cases, pipes operate on the `arguments` being processed by a [controller route handler](https://docs.nestjs.com/controllers#route-parameters). Nest interposes a pipe just before a method is invoked, and the pipe receives the arguments destined for the method and operates on them. Any transformation or validation operation takes place at that time, after which the route handler is invoked with any (potentially) transformed arguments.

Nest comes with a number of built-in pipes that you can use out-of-the-box. You can also build your own custom pipes. In this chapter, we'll introduce the built-in pipes and show how to bind them to route handlers. We'll then examine several custom-built pipes to show how you can build one from scratch.

> **Hint**
> Pipes run inside the exceptions zone. This means that when a Pipe throws an exception it is handled by the exceptions layer (global exceptions filter and any **exceptions filters** that are applied to the current context). Given the above, it should be clear that when an exception is thrown in a Pipe, no controller method is subsequently executed. This gives you a best-practice technique for validating data coming into the application from external sources at the system boundary.
