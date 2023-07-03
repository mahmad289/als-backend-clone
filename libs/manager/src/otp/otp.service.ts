import { OTPGenerate } from 'als/building-block/RequestableDto/OTP/OTPGenerate';
import { OTPVerify } from 'als/building-block/RequestableDto/OTP/OTPVerify';
import { FlattenMaps } from 'mongoose';

import { ContactModel } from '../contact/contact.model';

export abstract class IOtpService {
  abstract generateOTP(
    otpGeneratePayload: OTPGenerate,
  ): Promise<{ message: string }>;

  abstract validateOTP(otpVerifyPayload: OTPVerify): Promise<{
    access_token: string;
  }>;

  abstract generateAccessToken(payload: FlattenMaps<ContactModel>): Promise<{
    access_token: string;
  }>;
}
