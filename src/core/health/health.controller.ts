import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HealthCheckDto } from './health-check.dto';

@ApiTags('Health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate the global request pipeline',
  })
  @ApiBody({
    type: HealthCheckDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request body passed validation successfully.',
    type: HealthCheckDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body failed validation.',
  })
  validate(@Body() body: HealthCheckDto): HealthCheckDto {
    return body;
  }
}
