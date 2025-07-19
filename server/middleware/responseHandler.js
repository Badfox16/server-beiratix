const responseHandler = (req, res, next) => {
  /**
   * Envia uma resposta de sucesso padronizada.
   * @param {object} data - Os dados a serem enviados na resposta.
   * @param {number} [statusCode=200] - O código de estado HTTP.
   */
  res.success = (data, statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      data: data
    });
  };

  /**
   * Envia uma resposta de erro padronizada.
   * @param {string} message - A mensagem de erro.
   * @param {number} [statusCode=400] - O código de estado HTTP.
   */
  res.error = (message, statusCode = 400) => {
    res.status(statusCode).json({
      success: false,
      error: message
    });
  };

  next();
};

export default responseHandler;