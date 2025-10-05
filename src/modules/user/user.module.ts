import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '../../shareds/config/config.module';
import { ConfigService } from '../../shareds/config/config.service';
import { DatabaseModule } from '../../shareds/database/database.module';
import { MailModule } from '../../shareds/mail/mail.module';
import { CloudinaryModule } from '../../shareds/cloudinary/cloudinary.module';
import { JwtStrategy } from '../../commons/passports/jwt.passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: configService.jwtExpiration },
      }),
    }),
    DatabaseModule,
    MailModule,
    CloudinaryModule,
    ConfigModule,
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
