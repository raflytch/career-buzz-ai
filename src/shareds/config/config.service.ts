import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../commons/dtos/config/config.dto';

@Injectable()
export class ConfigService {
  constructor(
    private readonly configService: NestConfigService<EnvironmentVariables>,
  ) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get databaseUrl(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'secret');
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION', '7d');
  }

  get cloudinaryCloudName(): string | undefined {
    return this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
  }

  get cloudinaryApiKey(): string | undefined {
    return this.configService.get<string>('CLOUDINARY_API_KEY');
  }

  get cloudinaryApiSecret(): string | undefined {
    return this.configService.get<string>('CLOUDINARY_API_SECRET');
  }

  get emailUser(): string | undefined {
    return this.configService.get<string>('EMAIL_USER');
  }

  get emailPassword(): string | undefined {
    return this.configService.get<string>('EMAIL_PASSWORD');
  }
}
