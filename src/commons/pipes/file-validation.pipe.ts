import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import { MulterFile } from '../interfaces/multer.interface';

@Injectable()
export class FileValidationPipe
  implements PipeTransform<MulterFile | undefined, MulterFile | undefined>
{
  private readonly maxSize = 5 * 1024 * 1024;

  transform(file: MulterFile | undefined): MulterFile | undefined {
    if (!file) {
      return undefined;
    }

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

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    return file;
  }
}
