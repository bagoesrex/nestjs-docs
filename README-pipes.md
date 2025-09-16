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

## Built-in pipes

Nest comes with several pipes available out-of-the-box:

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`
- `ParseDatePipe`

They're exported from the `@nestjs/common` package.

Let's take a quick look at using `ParseIntPipe`. This is an example of the **transformation** use case, where the pipe ensures that a method handler parameter is converted to a JavaScript integer (or throws an exception if the conversion fails). Later in this chapter, we'll show a simple custom implementation for a `ParseIntPipe`. The example techniques below also apply to the other built-in transformation pipes (`ParseBoolPipe`, `ParseFloatPipe`, `ParseEnumPipe`, `ParseArrayPipe`, `ParseDatePipe`, and `ParseUUIDPipe`, which we'll refer to as the `Parse\*` pipes in this chapter).

## Binding pipes

To use a pipe, we need to bind an instance of the pipe class to the appropriate context. In our `ParseIntPipe` example, we want to associate the pipe with a particular route handler method, and make sure it runs before the method is called. We do so with the following construct, which we'll refer to as binding the pipe at the method parameter level:

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.keonksService.findOne(id);
}
```

This ensures that one of the following two conditions is true: either the parameter we receive in the `findOne()` method is a number (as expected in our call to this.`keonksService.findOne()`), or an exception is thrown before the route handler is called.

For example, assume the route is called like:

```ts
GET localhost:3000/apcb
```

Nest will throw an exception like this:

```ts
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

The exception will prevent the body of the `findOne()` method from executing.

In the example above, we pass a class (`ParseIntPipe`), not an instance, leaving responsibility for instantiation to the framework and enabling dependency injection. As with pipes and guards, we can instead pass an in-place instance. Passing an in-place instance is useful if we want to customize the built-in pipe's behavior by passing options:

```ts
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.keonksService.findOne(id);
}
```

Binding the other transformation pipes (all of the **Parse\*** pipes) works similarly. These pipes all work in the context of validating route parameters, query string parameters and request body values.

For example with a query string parameter:

```ts
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.keonksService.findOne(id);
}
```

Here's an example of using the `ParseUUIDPipe` to parse a string parameter and validate if it is a UUID.

```ts
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.keonksService.findOne(uuid);
}
```

> **Hint**
> When using `ParseUUIDPipe()` you are parsing UUID in version 3, 4 or 5, if you only require a specific version of UUID you can pass a version in the pipe options.

Above we've seen examples of binding the various `Parse\*` family of built-in pipes. Binding validation pipes is a little bit different; we'll discuss that in the following section.

> **Hint**
> Also, see [Validation techniques](https://docs.nestjs.com/techniques/validation) for extensive examples of validation pipes.
