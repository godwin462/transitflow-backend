import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/auth.decorator';
import { CreateShiftRequestDto } from 'src/shift/dto/create-shift.dto';
import { CreateTripRequestDto } from 'src/trip/dto/create-trip.dto';

/**
 * Test controller for validating error handling
 * This can be removed after verification
 */
@Controller('test-validation')
export class ValidationTestController {
  @Post('shift')
  @Public()
  testShiftValidation(@Body() payload: CreateShiftRequestDto) {
    return {
      message: 'Validation passed',
      data: payload,
    };
  }

  @Post('trip')
  @Public()
  testTripValidation(@Body() payload: CreateTripRequestDto) {
    return {
      message: 'Validation passed',
      data: payload,
    };
  }
}
