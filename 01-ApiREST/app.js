import express, { json } from 'express'
import { createMovieRouter } from './routes/moviesRoutes.js'
import { corsMiddleware } from './middlewares/cors.js'

// Creamos una función para crear la aplicación
export const createApp = ({ movieModel }) => {
  const app = express() // Creamos una instancia de express
  app.use(json()) // Middleware para parsear JSON

  app.use(corsMiddleware()) // Habilita CORS para todas las rutas

  app.use('/movies', createMovieRouter({ movieModel })) // Usamos las rutas de películas

  const PORT = process.env.PORT || 1234

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
  })
}
