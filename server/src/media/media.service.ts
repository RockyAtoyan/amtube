import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, rmSync, writeFile } from 'fs';
import { join } from 'path';

@Injectable()
export class MediaService {
  private UPLOADS_FOLDER_PATH = join(__dirname, '..', '..', '/uploads');
  private USERS_AVATARS_PATH = this.UPLOADS_FOLDER_PATH + '/users-avatars';

  saveFile(file: Express.Multer.File, uploadPath: string, filename?: string) {
    return this.save(uploadPath, file, filename);
  }

  private async save(
    uploadPath: string,
    file: Express.Multer.File,
    filename?: string,
  ) {
    const etc = file.originalname.split('.')[1];
    if (!etc) throw new BadRequestException();
    const name = filename + '.' + etc;
    const path = join(uploadPath, name);
    const fullPath = join(this.UPLOADS_FOLDER_PATH, path);
    if (existsSync(fullPath))
      throw new BadRequestException('File is already exists!');
    try {
      return await new Promise<string>((resolve, reject) => {
        writeFile(fullPath, file.buffer, (error) => {
          if (error) {
            reject(error);
          }
          resolve(path);
        });
      });
    } catch (error) {
      await this.deleteFile(uploadPath);
      throw new BadRequestException();
    }
  }

  private async deleteFile(uploadPath: string) {
    try {
      rmSync(uploadPath, { force: true });
    } catch (error) {}
  }
}
