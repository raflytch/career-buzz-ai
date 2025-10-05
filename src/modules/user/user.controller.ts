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
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ResetPasswordDto,
  ResendOtpDto,
  ForgotPasswordDto,
} from './dtos/user-create.dto';
import { UpdateUserDto } from './dtos/user-update.dto';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { FileValidationPipe } from '../../commons/pipes/file-validation.pipe';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP for registration' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.userService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP for registration' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.userService.resendOtp(resendOtpDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with OTP' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('resend-reset-password-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend reset password OTP' })
  async resendResetPasswordOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.userService.resendResetPasswordOtp(resendOtpDto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Req() req: { user: { userId: string } }) {
    return this.userService.getProfile(req.user.userId);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @Req() req: { user: { userId: string } },
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(new FileValidationPipe()) file?: Express.Multer.File,
  ) {
    return this.userService.updateProfile(req.user.userId, updateUserDto, file);
  }
}
