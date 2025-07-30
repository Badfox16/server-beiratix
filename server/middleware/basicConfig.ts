import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

// Configurar CORS
export const configureCORS = () => {
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173',
      'https://beiratix.vercel.app'];

  const isDev = process.env.NODE_ENV !== 'production';
  console.log(isDev ? 'Ambiente de desenvolvimento' : 'Ambiente de produção');

  return cors({
    origin: (origin, callback) => {
      // Permitir qualquer origem no ambiente de desenvolvimento
      if (isDev) {
        callback(null, true);
      } else {
        // Verificar se a origem está na lista permitida
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
};

// Configurar Morgan (logging)
export const configureLogging = () => {
  const isDev = process.env.NODE_ENV !== 'production'
  return morgan(isDev ? 'dev' : 'combined')
}

// Configurar middlewares básicos
export const configureBasicMiddleware = (app: express.Application) => {
  // Middleware para parsear JSON
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

}