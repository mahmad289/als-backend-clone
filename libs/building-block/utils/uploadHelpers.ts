import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads');
    // Create the directory for the file
    try {
      mkdirSync(uploadPath, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        return cb(err, uploadPath);
      }

      return cb(err, uploadPath);
    }

    // Pass the file path to multer
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);

    cb(null, `${uuidv4() + ext}`);
  },
});

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function isFilenameFormatUUIDv4(name: string): boolean {
  const pattern =
    /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+.[a-zA-Z]+$/;

  return pattern.test(name);
}
