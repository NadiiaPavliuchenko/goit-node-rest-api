import multer from "multer";
import * as path from "node:path";
import fs from "fs";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const destinationPath = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

export default multer({ storage });
