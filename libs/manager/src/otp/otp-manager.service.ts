import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { OTPGenerate } from 'als/building-block/RequestableDto/OTP/OTPGenerate';
import { OTPVerify } from 'als/building-block/RequestableDto/OTP/OTPVerify';
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  ContactModel,
  ContactModelDocument,
} from 'als/manager/contact/contact.model';
import { OTPModel, OTPModelDocument } from 'als/manager/otp/otp.model';
import { EmailService } from 'libs/email-service/EmailService';
import { FlattenMaps, Model } from 'mongoose';

import { IAssignProjectService } from '../assign-project/assign-project.service';
import { IComplianceService } from '../compliance/services/compliance.service';
import { IOtpService } from './otp.service';

@Injectable()
export class OtpManagerService implements IOtpService {
  logger = new Logger();
  constructor(
    @InjectModel(ContactModel.name)
    private readonly contactModel: Model<ContactModelDocument>,
    @InjectModel(OTPModel.name)
    private readonly otpModel: Model<OTPModelDocument>,

    private assignProjectService: IAssignProjectService,
    private jwtService: JwtService,
    private readonly complianceService: IComplianceService,
    private emailService: EmailService,
  ) {}

  async generateOTP(otpGeneratePayload: OTPGenerate) {
    try {
      const assignedProject = await this.assignProjectService.findOne({
        uuid: otpGeneratePayload.uuid,
      });

      if (!assignedProject) {
        throw new ServiceError(
          'Project may have been deleted',
          HttpStatus.BAD_REQUEST,
        );
      }

      const compliance = await this.complianceService.findOne({
        _id: assignedProject.compliance_id,
      });

      if (!compliance || !compliance.status) {
        throw new ServiceError(
          'Project may have been deleted',
          HttpStatus.BAD_REQUEST,
        );
      }

      const contact = await this.contactModel.findById({
        _id: assignedProject.contact_id,
      });

      if (!contact) {
        throw new ServiceError(
          'Your account may have been deleted',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Delete all existing OTP's associated with given email
      await this.otpModel.deleteMany({
        email: contact.email,
      });

      // Create a single collection in OTP Table for given vendor's contact
      const randomSixDigitCode = Math.random().toString().substr(2, 6);
      const otpCreate: Omit<OTPModel, '_id' | 'attempts'> = {
        email: contact.email,
        contact_id: assignedProject?.contact_id,
        otp: randomSixDigitCode,
        project_assignee: assignedProject?.contact_id,
      };

      const newOTP = await this.otpModel.create(otpCreate);
      const mailOptions = {
        to: contact.email,
        subject: 'OTP for Login',
        html: `<p>Dear user, Please use the following OTP code to login into your account ${newOTP.otp}</p>`,
      };

      this.emailService.sendEmail(mailOptions);
      return {
        message: 'OTP Sent to Your Registered Email',
      };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async validateOTP(otpVerifyPayload: OTPVerify) {
    try {
      const assignedProject = await this.assignProjectService.findOne({
        uuid: otpVerifyPayload.uuid,
      });

      if (!assignedProject) {
        throw new ServiceError(
          'Project may have been deleted',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.otpModel.findOne({
        contact_id: assignedProject.contact_id,
      });

      if (!res) {
        throw new ServiceError(
          'OTP expired, Generate a new One Time Password(OTP)',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (otpVerifyPayload.otp === res.otp) {
        const projectAssignee = await this.contactModel.findOne({
          email: res.email,
        });

        if (!projectAssignee) {
          throw new ServiceError('Invalid Account', HttpStatus.BAD_REQUEST);
        }

        await this.otpModel.deleteMany({
          email: projectAssignee.email,
        });

        const access_token = await this.generateAccessToken(
          projectAssignee.toJSON(),
        );

        return access_token;
      }

      throw new ServiceError('Incorrect OTP', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async generateAccessToken(payload: FlattenMaps<ContactModel>) {
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
      }),
    };
  }
}
