import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './shareds/config/config.module';
import { DatabaseModule } from './shareds/database/database.module';
import { UserModule } from './modules/user/user.module';
import { CloudinaryModule } from './shareds/cloudinary/cloudinary.module';
import { MailModule } from './shareds/mail/mail.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutes
    }),
    ConfigModule,
    DatabaseModule,
    UserModule,
    CloudinaryModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
