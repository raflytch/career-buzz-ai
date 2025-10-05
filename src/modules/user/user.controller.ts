import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterDto } from './dtos/user-register.dto';
import { LoginDto } from './dtos/user-login.dto';
import {
  VerifyOtpDto,
  ResetPasswordDto,
  ResendOtpDto,
  ForgotPasswordDto,
} from './dtos/user-otp.dto';
import { UpdateUserDto } from './dtos/user-update.dto';
import {
  AuthResponse,
  MessageResponse,
  ProfileResponse,
} from './dtos/user-response.dto';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { FileValidationPipe } from '../../commons/pipes/file-validation.pipe';
import { MulterFile } from '../../commons/interfaces/multer.interface';

@ApiTags('users')
@Controller('v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto): Promise<MessageResponse> {
    return this.userService.register(registerDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP for registration' })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<MessageResponse> {
    return this.userService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.userService.login(loginDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP for registration' })
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<MessageResponse> {
    return this.userService.resendOtp(resendOtpDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponse> {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with OTP' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponse> {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('resend-reset-password-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend reset password OTP' })
  async resendResetPasswordOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<MessageResponse> {
    return this.userService.resendResetPasswordOtp(resendOtpDto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(
    @Req() req: { user: { userId: string } },
  ): Promise<ProfileResponse> {
    return this.userService.getProfile(req.user.userId);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update user profile with optional name and avatar',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'New name for the user (optional)',
          example: 'John Doe',
        },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (optional, max 5MB, only images)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @Req() req: { user: { userId: string } },
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(new FileValidationPipe()) file?: MulterFile,
  ): Promise<Omit<ProfileResponse, 'isVerified'>> {
    return this.userService.updateProfile(req.user.userId, updateUserDto, file);
  }
}
