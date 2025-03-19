import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, writeFile } from 'fs';
import { join } from 'path';

@Injectable()
export class MediaService {
  private UPLOADS_FOLDER_PATH = join(__dirname, '..', '..', '/uploads');
  private USERS_AVATARS_PATH = this.UPLOADS_FOLDER_PATH + '/users-avatars';

  saveFile(file: Express.Multer.File, uploadPath: string) {
    return this.save(this.UPLOADS_FOLDER_PATH + uploadPath, file);
  }

  async saveUserAvatar(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const etc = file.originalname.split('.')[1];
    if (!etc) throw new BadRequestException();
    const filename = userId + '.' + etc;
    const uploadPath = this.USERS_AVATARS_PATH + '/' + filename;
    await this.save(uploadPath, file);
    return uploadPath;
  }

  private async save(uploadPath: string, file: Express.Multer.File) {
    if (existsSync(uploadPath))
      throw new BadRequestException('File is already exists!');
    try {
      await new Promise<void>((resolve, reject) => {
        writeFile(uploadPath, file.buffer, (error) => {
          if (error) {
            reject(error);
          }
          resolve();
        });
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
