const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    // Copia req.query para não modificar o original
    const reqQuery = { ...req.query };

    // Campos a serem excluídos da filtragem
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Remove os campos especiais do objeto de query
    removeFields.forEach(param => delete reqQuery[param]);

    // Converte o objeto de query para uma string para poder substituir os operadores
    let queryStr = JSON.stringify(reqQuery);

    // Adiciona o '$' na frente dos operadores de comparação (gt, gte, etc.)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Constrói a query inicial com os filtros
    query = model.find(JSON.parse(queryStr));

    // 1. Select (Seleção de Campos)
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // 2. Sort (Ordenação)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        // Ordenação padrão por data de criação (mais recentes primeiro)
        query = query.sort('-createdAt');
    }

    // 3. Paginação
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25; // Limite padrão de 25
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Adiciona o 'populate' se for especificado
    if (populate) {
        query = query.populate(populate);
    }

    // Executa a query
    const results = await query;

    // Constrói o objeto de paginação para a resposta
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    // Anexa os resultados e a paginação ao objeto 'res'
    res.advancedResults = {
        success: true,
        count: total, // Total de documentos no banco (com filtros aplicados)
        currentPageCount: results.length, // Número de itens na página atual
        pagination,
        data: results
    };

    next();
};

export default advancedResults;
