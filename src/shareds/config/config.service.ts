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

  // Add getters for other env vars
}
