import { BadRequestException, Injectable } from '@nestjs/common';
import fs from 'fs';

@Injectable()
export class FileService {
  private PUBLIC_FOLDER_PATH = '/uploads';
  private USERS_AVATARS_PATH = this.PUBLIC_FOLDER_PATH + '/users-avatars';

  async saveUserAvatar(
    file: Express.Multer.File,
    userEmail: string,
  ): Promise<string> {
    const etc = file.originalname.split('.')[1];
    if (!etc) throw new BadRequestException();
    const filename = userEmail + '.' + etc;
    const uploadPath = this.USERS_AVATARS_PATH + '/' + filename;
    await this.saveFile(uploadPath, file);
    return uploadPath;
  }

  private async saveFile(uploadPath: string, file: Express.Multer.File) {
    try {
      await new Promise<void>((resolve, reject) => {
        fs.writeFile(uploadPath, file.buffer, (error) => {
          if (error) {
            reject(error);
          }
          resolve();
        });
      });
    } catch {
      throw new BadRequestException();
    }
  }
}
