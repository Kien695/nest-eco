import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import envConfig from '../shared/config';

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  async uploadImages(files: Express.Multer.File[]): Promise<UploadedImage[]> {
    const uploaded: UploadedImage[] = [];
    try {
      // Upload sequentially to limit upstream concurrency and stop on failure.
      for (const file of files) {
        uploaded.push(await this.uploadImage(file));
      }
      return uploaded;
    } catch (error) {
      for (const image of uploaded) {
        try {
          const options = {
            cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
            api_key: envConfig.CLOUDINARY_API_KEY,
            api_secret: envConfig.CLOUDINARY_API_SECRET,
            resource_type: 'image' as const,
            invalidate: true,
            timeout: 60000,
          };
          const result = (await cloudinary.uploader.destroy(
            image.publicId,
            options,
          )) as { result: string };
          if (result.result !== 'ok' && result.result !== 'not found') {
            throw new Error('Unexpected cleanup response');
          }
        } catch {
          this.logger.error(
            `Failed to clean up Cloudinary image: ${image.publicId}`,
          );
        }
      }
      throw error;
    }
  }

  uploadImage(file: Express.Multer.File): Promise<UploadedImage> {
    const {
      CLOUDINARY_CLOUD_NAME: cloudName,
      CLOUDINARY_API_KEY: apiKey,
      CLOUDINARY_API_SECRET: apiSecret,
      CLOUDINARY_FOLDER: folder,
    } = envConfig;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new ServiceUnavailableException('Cloudinary is not configured');
    }

    return new Promise((resolve, reject) => {
      const fail = () =>
        reject(new BadGatewayException('Failed to upload image to Cloudinary'));

      try {
        const stream = cloudinary.uploader.upload_stream(
          {
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            folder,
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            timeout: 60000,
          },
          (error, result) => {
            if (error || !result) {
              fail();
              return;
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            });
          },
        );
        stream.on('error', fail);
        stream.end(file.buffer);
      } catch {
        fail();
      }
    });
  }
}
