const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Para debugging no servidor

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Ocorreu um erro interno no servidor.';

  // Tratar erros específicos do Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    // Formata as mensagens de erro de validação
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400; // Bad Request
    message = `Recurso não encontrado. ID inválido: ${err.path} = ${err.value}`;
  }

  // Tratar erro de chave duplicada do MongoDB
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `O campo '${field}' com o valor '${value}' já existe.`;
  }
  
  // Tratar erros do Multer
  if (err instanceof multer.MulterError) {
    statusCode = 400; // Bad Request
    message = `Erro no upload do ficheiro: ${err.message}`;
  }


  res.status(statusCode).json({
    success: false,
    error: message
  });
};

export default errorHandler;