import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './shareds/config/config.module';
import { DatabaseModule } from './shareds/database/database.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutes
    }),
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
