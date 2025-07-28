import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const certificadosDir = join(
  __dirname,
  "..",
  "uploads",
  "certificadosResidencia",
);

if (!fs.existsSync(certificadosDir)) {
  fs.mkdirSync(certificadosDir, { recursive: true });
}

const storageCertificados = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, certificadosDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export async function eliminarCertificado(certificado) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fullPath = path.join(__dirname, "..", certificado);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`Certificado eliminado: ${fullPath}`);
    } catch (fileError) {
      console.error(`Error al eliminar certificado: ${fileError.message}`);
    }
  }
}

export const uploadCertificados = multer({ storage: storageCertificados });
