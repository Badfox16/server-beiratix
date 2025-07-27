import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// 1. Configuração do Multer para aceitar múltiplos ficheiros na memória
const MimeTypesPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/jpg', 'image/tiff'];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (MimeTypesPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de ficheiro inválido.'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB por ficheiro
  }
});

// 2. Função para fazer o upload de UM buffer para o Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'eitickets',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// 3. O Middleware principal que combina tudo para múltiplos uploads
const imageUploadHandler = (req, res, next) => {
  // Usa o 'upload.array' do multer para processar múltiplos ficheiros.
  // 'images' é o nome do campo no formulário (ex: <input type="file" name="images" multiple>)
  // O '10' é o número máximo de ficheiros permitidos.
  upload.array('images', 10)(req, res, async (err) => {
    if (err) {
      // Erros do Multer (tamanho, tipo, limite de ficheiros) serão apanhados aqui
      return next(err);
    }

    // Se não houver ficheiros, simplesmente continua
    if (!req.files || req.files.length === 0) {
      return next();
    }

    try {
      // Faz o upload de todos os buffers para o Cloudinary em paralelo
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
      const results = await Promise.all(uploadPromises);
      
      // Adiciona um array de URLs seguras ao objeto 'req' para uso posterior
      req.cloudinaryUrls = results.map(result => result.secure_url);

      next(); // Passa para o próximo middleware ou para o controlador da rota
    } catch (uploadError) {
      // Erros do Cloudinary serão apanhados aqui
      next(uploadError);
    }
  });
};

export default imageUploadHandler;
