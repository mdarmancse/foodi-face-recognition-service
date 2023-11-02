import multer from "multer";
const AllowedMimetypes: string[] = ["image/jpeg", "image/jpg", "image/png"];
const MaxFileSize = 5 * 1024 * 1024;

export class FileTypeError extends Error {}

const storage = multer.memoryStorage();

const uploader = multer({
  storage: storage,
  limits: {
    fileSize: MaxFileSize,
  },
  fileFilter: (req, file, callback) => {
    if (AllowedMimetypes.some((mt) => mt === file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new FileTypeError("File type not supported"));
  },
});

export const singleUploadLocal = (fieldName: string) =>
  uploader.single(fieldName);
