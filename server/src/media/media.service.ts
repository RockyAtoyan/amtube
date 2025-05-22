import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, rmSync, writeFile } from 'fs';
import { ensureDirSync } from 'fs-extra';
import { join } from 'path';

@Injectable()
export class MediaService {
  private UPLOADS_FOLDER_PATH = join(process.cwd(), 'uploads');
  private USERS_AVATARS_PATH = this.UPLOADS_FOLDER_PATH + '/users-avatars';

  saveFile(file: Express.Multer.File, uploadPath: string, filename: string) {
    return this.save(uploadPath, file, filename);
  }

  private async save(
    uploadPath: string,
    file: Express.Multer.File,
    filename: string,
  ) {
    const etc = this.getFileExtension(file.originalname);
    if (!etc) throw new BadRequestException();
    const name = filename + '.' + etc;
    const path = join(uploadPath, name);
    const dirFullPath = join(this.UPLOADS_FOLDER_PATH, uploadPath);
    ensureDirSync(dirFullPath);
    const fullPath = join(this.UPLOADS_FOLDER_PATH, path);
    if (existsSync(fullPath))
      await this.deleteFile(fullPath)
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

  private getFileExtension(filename) {
    const decodedName = decodeURIComponent(filename);

    const lastDotIndex = decodedName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === decodedName.length - 1) {
      return '';
    }

    return decodedName.slice(lastDotIndex + 1).toLowerCase();
  }
}
