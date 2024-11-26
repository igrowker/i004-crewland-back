import { Module } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festivals } from './entities/festival.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Festivals]), ConfigModule],
  controllers: [FestivalsController],
  providers: [FestivalsService],
  exports: [TypeOrmModule],
})
export class FestivalsModule {}

// import { Module } from '@nestjs/common';
// import { FestivalsService } from './festivals.service';
// import { FestivalsController } from './festivals.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Festivals } from './entities/festival.entity';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Festivals]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get('JWT_SECRET'),
//         signOptions: { expiresIn: '8h' },
//       }),
//       inject: [ConfigService],
//     }),
//     ConfigModule, // This ensures ConfigService is available in this module
//   ],
//   controllers: [FestivalsController],
//   providers: [FestivalsService],
// })
// export class FestivalsModule { }
