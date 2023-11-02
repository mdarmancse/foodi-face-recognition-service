import "express";

declare global {
  interface User {
    id: number;
  }

  interface CustomMulterFile extends Express.Multer.File {
    key: string;
  }

  type S3File = Express.MulterS3.File;

  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
