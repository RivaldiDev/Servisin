import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.join(__dirname, '../../uploads');
const vehiclesDir = path.join(uploadsDir, 'vehicles');
const invoicesDir = path.join(uploadsDir, 'invoices');

// Ensure directories exist
[uploadsDir, vehiclesDir, invoicesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'photo' || file.fieldname === 'vehiclePhoto' || file.fieldname === 'avatar') {
      cb(null, vehiclesDir);
    } else {
      cb(null, invoicesDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const rawExt = path.extname(file.originalname).toLowerCase();
    const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.jpg';
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const rawExt = path.extname(file.originalname).toLowerCase();
  
  // Strict check: both extension and MIME type must be allowed and not SVG
  if (ALLOWED_MIME_TYPES.has(file.mimetype) && ALLOWED_EXTENSIONS.has(rawExt)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Harap upload gambar (JPEG, PNG, atau WEBP).'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Single file upload per request
  },
  fileFilter,
});
