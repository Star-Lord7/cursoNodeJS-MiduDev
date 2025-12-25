const express = require('express') // commonJS
const crypto = require('crypto') // Importa el módulo crypto para generar IDs únicos
const cors = require('cors')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express() // Creamos una instancia de express
app.use(express.json()) // Middleware para parsear JSON

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:1234',
      'http://127.0.0.1:5500',
      'http://localhost:5500'
    ]
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Origen no permitido por CORS'))
  }
})) // Habilita CORS para todas las rutas

// Ruta para obtener todas las películas o filtrar por género
app.get('/movies', (req, res) => {
  const { genre } = req.query // Obtenemos el género de los query params
  if (genre) {
    const filteredMovies = movies.filter(
      // Verificamos si el género existe en la lista de géneros de la película (case insensitive)
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

// Ruta para crear una nueva película
app.post('/movies', (req, res) => {
  // Validamos el cuerpo de la solicitud usando la función validateMovie
  // y pasandole como argumento "req.body"
  const result = validateMovie(req.body)

  // Validamos si existen errores de validación
  if (result.error) {
    return res.status(400).json({ errors: JSON.parse(result.error.message) })
  }

  // Si no hay errores, creamos una nueva película
  const newMovie = {
    id: crypto.randomUUID(), // Generamos un ID único "uuid v4"
    ...result.data // Y le pasamos el objeto con los datos validados
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

// Ruta para obtener una película por su ID
app.get('/movies/:id', (req, res) => {
  const { id } = req.params // Obtenemos el ID de los parámetros de la ruta
  // Buscamos la película con el ID correspondiente
  const movie = movies.find(movie => movie.id === id)
  if (movie) {
    res.json(movie)
  } else {
    res.status(404).json({ message: 'Movie not found' })
  }
})

// Ruta para actualizar una película por su ID
app.patch('/movies/:id', (req, res) => {
  // Validamos el cuerpo de la solicitud usando la función validatePartialMovie
  // y pasandole como argumento "req.body"
  const result = validatePartialMovie(req.body)

  // Validamos si existen errores de validación
  if (result.error) {
    return res.status(400).json({ errors: JSON.parse(result.error.message) })
  }

  const { id } = req.params // Obtenemos el ID de los parámetros de la ruta
  // Si no hay errores, buscamos la película por su ID
  const movieIndex = movies.findIndex(movie => movie.id === id)

  // Si no se encuentra la película, devolvemos un error 404
  if (movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

  // Actualizamos solo los campos proporcionados en el cuerpo de la solicitud y el objeto validado
  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  // Reemplazamos la película en el array con la película actualizada
  movies[movieIndex] = updatedMovie

  // Devolvemos la película actualizada
  return res.json(updatedMovie)
})

// Ruta para eliminar una película por su ID
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params // Obtenemos el ID de los parámetros de la ruta
  const movieIndex = movies.findIndex(movie => movie.id === id)

  // Si no se encuentra la película, devolvemos un error 404
  if (movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

  // Eliminamos la película del array
  movies.splice(movieIndex, 1)

  // Devolvemos un mensaje de éxito
  return res.json({ message: 'Movie deleted successfully' })
})

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
