import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize = 5 * 1024 * 1024;

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (file.size > this.maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
      'image/webp',
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    return file;
  }
}
