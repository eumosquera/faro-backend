import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { HealthCheckDto } from './health-check.dto';

@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  validate(@Body() body: HealthCheckDto): HealthCheckDto {
    return body;
  }
}
