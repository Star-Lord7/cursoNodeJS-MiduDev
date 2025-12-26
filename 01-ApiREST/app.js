import express, { json } from 'express'
import moviesRoutes from './routes/moviesRoutes.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express() // Creamos una instancia de express
app.use(json()) // Middleware para parsear JSON

app.use(corsMiddleware()) // Habilita CORS para todas las rutas

app.use('/movies', moviesRoutes) // Usamos las rutas de películas

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
