import multer from "multer";
import fs from "fs";
import path from "path";

// Temporary local storage before files are pushed to Cloudinary and removed.
const tmpDir = path.join(process.cwd(), "uploads", "tmp");
fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, tmpDir);
  },
  filename: (req, file, callback) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) callback(null, true);
    else callback(new Error("Only image files are allowed"));
  },
});

export default upload;
