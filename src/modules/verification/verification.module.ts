import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendgridModule } from '../../shared/mail/sendgrid/sendgrid.module';
import { VerificationCodeEmail } from './entities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationCodeEmail]), SendgridModule],
  providers: [VerificationService],
  controllers: [VerificationController],
})
export class VerificationModule {}
