import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    //model: code here <<<
    return 'Hello World!';
  }
}
