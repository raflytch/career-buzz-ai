import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../shareds/database/database.service';
import { MailService } from '../../shareds/mail/mail.service';
import { CloudinaryService } from '../../shareds/cloudinary/cloudinary.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ResetPasswordDto,
  ResendOtpDto,
  ForgotPasswordDto,
} from './dtos/user-create.dto';
import { UpdateUserDto } from './dtos/user-update.dto';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private mailService: MailService,
    private cloudinaryService: CloudinaryService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.cacheManager.set(`otp:${registerDto.email}`, otp, 600000);

    await this.databaseService.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        isVerified: false,
      },
    });

    await this.mailService.sendOtpEmail(registerDto.email, otp);

    return { message: 'Registration successful. Please verify your email.' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const cachedOtp = await this.cacheManager.get<string>(
      `otp:${verifyOtpDto.email}`,
    );

    if (!cachedOtp || cachedOtp !== verifyOtpDto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.databaseService.user.update({
      where: { email: verifyOtpDto.email },
      data: { isVerified: true },
    });

    await this.cacheManager.del(`otp:${verifyOtpDto.email}`);

    return { message: 'Email verified successfully' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: resendOtpDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(`otp:${resendOtpDto.email}`, otp, 600000);
    await this.mailService.sendOtpEmail(resendOtpDto.email, otp);

    return { message: 'OTP resent successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(
      `reset-password:${forgotPasswordDto.email}`,
      otp,
      600000,
    );
    await this.mailService.sendResetPasswordOtp(forgotPasswordDto.email, otp);

    return { message: 'Reset password OTP sent successfully' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const cachedOtp = await this.cacheManager.get<string>(
      `reset-password:${resetPasswordDto.email}`,
    );

    if (!cachedOtp || cachedOtp !== resetPasswordDto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.databaseService.user.update({
      where: { email: resetPasswordDto.email },
      data: { password: hashedPassword },
    });

    await this.cacheManager.del(`reset-password:${resetPasswordDto.email}`);

    return { message: 'Password reset successfully' };
  }

  async resendResetPasswordOtp(resendOtpDto: ResendOtpDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: resendOtpDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(
      `reset-password:${resendOtpDto.email}`,
      otp,
      600000,
    );
    await this.mailService.sendResetPasswordOtp(resendOtpDto.email, otp);

    return { message: 'Reset password OTP resent successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let avatarUrl = user.avatar;

    if (file) {
      avatarUrl = await this.cloudinaryService.uploadFile(file);
    }

    const updatedUser = await this.databaseService.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.name || user.name,
        avatar: avatarUrl,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    };
  }
}
