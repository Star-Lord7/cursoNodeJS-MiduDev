import cors from 'cors'

// Función middleware para configurar CORS
export const corsMiddleware = () => cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:1234',
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'https://api-rest-samuel.netlify.app'
    ]
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Origen no permitido por CORS'))
  }
})
