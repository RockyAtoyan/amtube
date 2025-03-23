export interface ProcessVideoJobPayload {
  videoId: string;
  videoFileName: string;
  videoFile: Express.Multer.File;
}
