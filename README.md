## Controllers

![Controller Image](./docs/images/controller.png)

Controllers are responsible for handling **incoming requests** and **sending responses** back to the client. 

> **Hint**
To quickly create a CRUD controller with built-in validation, you can use the CLI's CRUD generator ```nest g resource [name]```.

## Routing

To create a basic controller, we use the @Controller() decorator.
You can add a route prefix like ```@Controller('cats')``` to group related endpoints ```(/cats)```.

```ts
cats.controller.ts

import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}

```

> **Hint**
To create a controller using the CLI, simply execute the ```nest g controller [name]```.