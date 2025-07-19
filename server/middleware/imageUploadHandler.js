import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// 1. Configuração do Multer (igual à anterior, para validar e carregar para a memória)
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
    fileSize: 1024 * 1024 * 5 // 5 MB
  }
});

// 2. Função para fazer o upload para o Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Usamos 'upload_stream' para enviar o buffer da memória
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // Opcional: defina uma pasta no Cloudinary para organizar os uploads
        folder: 'eitickets', 
        // Opcional: pode adicionar transformações aqui
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    // Enviamos o buffer para o stream do Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};


// 3. O Middleware principal que combina tudo
const imageUploadHandler = (req, res, next) => {
  // Usa o 'upload.single' do multer para processar um único ficheiro.
  // 'image' é o nome do campo no formulário (ex: <input type="file" name="image">)
  upload.single('image')(req, res, async (err) => {
    if (err) {
      // Erros do Multer (tamanho, tipo de ficheiro) serão apanhados aqui
      return next(err);
    }

    // Se não houver ficheiro, simplesmente continua
    if (!req.file) {
      return next();
    }

    try {
      // Faz o upload do buffer do ficheiro para o Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);
      
      // Adiciona a URL segura da imagem ao objeto 'req' para uso posterior na rota
      req.cloudinaryUrl = result.secure_url;

      next(); // Passa para o próximo middleware ou para o controlador da rota
    } catch (uploadError) {
      // Erros do Cloudinary serão apanhados aqui
      next(uploadError);
    }
  });
};

export default imageUploadHandler;