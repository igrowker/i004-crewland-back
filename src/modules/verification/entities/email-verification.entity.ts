import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('verification_codes_email')
export class VerificationCodeEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 4 })
  code: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;
}
