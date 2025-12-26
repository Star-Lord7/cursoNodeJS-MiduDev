import { MovieModel } from '../models/movieModel.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  // Método para obtener todas las películas, con opción de filtrar por género
  static async getAll (req, res) {
    const { genre } = req.query // Obtenemos el género de los query params
    // Usamos el método estático getAll de la clase MovieModel
    const movies = await MovieModel.getAll({ genre })
    res.json(movies) // Devolvemos las películas en formato JSON
  }

  // Método para obtener una película por su ID
  static async getById (req, res) {
    const { id } = req.params // Obtenemos el ID de los parámetros de la ruta
    // Usamos el método estático getById de la clase MovieModel y le pasamos el ID
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie) // Devolvemos la película en formato JSON
    return res.status(404).json({ message: 'Movie not found' }) // Si no se encuentra, devolvemos un error 404
  }

  // Método para crear una nueva película
  static async create (req, res) {
    // Validamos el cuerpo de la solicitud usando la función validateMovie
    // y pasandole como argumento "req.body"
    const result = validateMovie(req.body)

    // Validamos si existen errores de validación
    if (result.error) {
      return res.status(400).json({ errors: JSON.parse(result.error.message) })
    }

    // Si no hay errores, creamos una nueva película usando el método estático create
    const newMovie = await MovieModel.create({ input: result.data })
    res.status(201).json(newMovie) // Devolvemos la nueva película con código 201 (creado)
  }

  // Método para actualizar una película por su ID
  static async update (req, res) {
    // Validamos el cuerpo de la solicitud usando la función validatePartialMovie
    // y pasandole como argumento "req.body"
    const result = validatePartialMovie(req.body)

    // Validamos si existen errores de validación
    if (result.error) {
      return res.status(400).json({ errors: JSON.parse(result.error.message) })
    }

    const { id } = req.params // Obtenemos el ID de los parámetros de la ruta

    // Usamos el método estático update de la clase MovieModel
    const updatedMovie = await MovieModel.update({ id, input: result.data })

    // Devolvemos la película actualizada
    return res.json(updatedMovie)
  }

  // Método para eliminar una película por su ID
  static async delete (req, res) {
    const { id } = req.params // Obtenemos el ID de los parámetros de la ruta
    // Usamos el método estático delete de la clase MovieModel
    const result = await MovieModel.delete({ id })

    // Si no se encuentra la película, devolvemos un error 404
    if (!result) return res.status(404).json({ message: 'Movie not found' })

    // Devolvemos un mensaje de éxito
    return res.json({ message: 'Movie deleted successfully' })
  }
}
