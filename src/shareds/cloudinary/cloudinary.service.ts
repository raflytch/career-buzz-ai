import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { MulterFile } from '../../commons/interfaces/multer.interface';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.cloudinaryCloudName,
      api_key: this.configService.cloudinaryApiKey,
      api_secret: this.configService.cloudinaryApiSecret,
    });
  }

  async uploadFile(file: MulterFile): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'auto' },
          (error: Error | undefined, result: UploadApiResponse | undefined) => {
            if (error) reject(new Error(error.message));
            else if (result) resolve(result.secure_url);
            else reject(new Error('Upload failed'));
          },
        )
         
        .end(file.buffer);
    });
  }
}
