


// storage.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crear carpetas si no existen
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(path.join(__dirname, "storage", "imgs"));
ensureDir(path.join(__dirname, "storage", "videos"));

// Configuración común para ambos
const generateStorage = (subdir) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "storage", subdir));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// Filtros
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Solo se permiten archivos de imagen."), false);
};

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Solo se permiten archivos de video."), false);
};

// Uploaders específicos
const uploadImage = multer({
  storage: generateStorage("imgs"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadVideo = multer({
  storage: generateStorage("videos"),
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

module.exports = {
  uploadImage,
  uploadVideo
};