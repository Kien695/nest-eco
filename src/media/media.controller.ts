import {
  Controller,
  BadRequestException,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { UPLOAD_DIR } from '../shared/constants/other.constant';
import { MediaService } from './media.service';
import {
  MAX_IMAGE_SIZE,
  MAX_IMAGE_COUNT,
} from '../shared/constants/media.constants';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/upload')
  @UseInterceptors(
    FilesInterceptor('files', MAX_IMAGE_COUNT, {
      limits: { fileSize: MAX_IMAGE_SIZE, files: MAX_IMAGE_COUNT, fields: 0 },
    }),
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.mediaService.uploadImages(files);
  }
  @Get('static/:filename')
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    if (!/^[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/i.test(filename)) {
      throw new BadRequestException('Invalid filename');
    }
    return res.sendFile(
      filename,
      { root: UPLOAD_DIR, dotfiles: 'deny' },
      (error) => {
        if (error) {
          res.status(404).json({
            message: 'File not found',
            statusCode: 404,
          });
        }
      },
    );
  }
}
