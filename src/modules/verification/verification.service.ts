import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCodeEmail } from './entities/verification.entity';
import { SendGridService } from '../../shared/mail/sendgrid/sendgrid.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationCodeEmail)
    private verificationCodeRepository: Repository<VerificationCodeEmail>,
    private sendGridService: SendGridService,
  ) {}

  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async loadTemplateWithCode(code: string): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '../../shared/utils/verificationCodeTemplate.html',
    );

    const template = fs.readFileSync(templatePath, 'utf8');

    return template.replace('{{code}}', code);
  }

  async sendVerificationCode(email: string): Promise<void> {
    const code = this.generateVerificationCode();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2);

    const newVerificationCode = this.verificationCodeRepository.create({
      code: code,
      verified: false,
      createdAt: new Date(),
      expiresAt: expiresAt,
    });

    await this.verificationCodeRepository.save(newVerificationCode);

    const html = await this.loadTemplateWithCode(code);
    const subject = 'Tu código de verificación';
    const text = `Tu código de verificación es: ${code}. Este código expira en 2 minutos.`;

    await this.sendGridService.sendEmail(email, subject, text, html);

    setTimeout(
      async () => {
        await this.verificationCodeRepository.delete({
          code: code,
          verified: false,
        });
      },
      2 * 60 * 1000,
    );
  }

  async validateCode(code: string): Promise<boolean> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { code },
    });

    if (!verificationCode) {
      return false;
    }

    const currentTime = new Date();

    if (verificationCode.expiresAt < currentTime) {
      verificationCode.verified = false;
      await this.verificationCodeRepository.save(verificationCode);
      return false;
    }

    if (!verificationCode.verified) {
      verificationCode.verified = true;
      await this.verificationCodeRepository.save(verificationCode);
      return true;
    }
    return false;
  }
}
