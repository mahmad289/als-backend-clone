import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'als/building-block/decorators/IsPublic';
import { OTPGenerate } from 'als/building-block/RequestableDto/OTP/OTPGenerate';
import { OTPVerify } from 'als/building-block/RequestableDto/OTP/OTPVerify';
import { IOtpService } from 'als/manager/otp/otp.service';

@IsPublic()
@ApiTags('Otp')
@Controller('otp')
export class OtpController {
  constructor(private otpService: IOtpService) {}

  @Post('generate')
  async generate(@Body() otpGeneratePayload: OTPGenerate) {
    try {
      return this.otpService.generateOTP(otpGeneratePayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('validate')
  async validate(@Body() otpVerifyPayload: OTPVerify) {
    try {
      return this.otpService.validateOTP(otpVerifyPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
