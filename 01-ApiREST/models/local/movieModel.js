import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils/utils.js'
const movies = readJSON('./../movies.json') // Leemos el JSON con las películas

export class MovieModel {
  // Método estático para obtener todas las películas, con opción de filtrar por género
  static async getAll ({ genre }) {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return movies
  }

  // Método estático para obtener una película por su ID
  static async getById ({ id }) {
    // Usamo el metodo find para buscar la película con el ID correspondiente
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  // Método estático para crear una nueva película
  static async create ({ input }) {
    // Si no hay errores, creamos una nueva película
    const newMovie = {
      id: randomUUID(), // Generamos un ID único "uuid v4"
      ...input // Y le pasamos el objeto con los datos validados
    }

    movies.push(newMovie)
    return newMovie
  }

  // Método estático para eliminar una película por su ID
  static async delete ({ id }) {
    // Usamos el método findIndex para buscar el índice de la película con el ID
    const movieIndex = movies.findIndex(movie => movie.id === id)

    // Si no se encuentra la película, devolvemos un error 404
    if (movieIndex < 0) return false

    // Usamos splice para eliminar la película del array
    movies.splice(movieIndex, 1)
    return true
  }

  // Método estático para actualizar una película por su ID
  static async update ({ id, input }) {
    // Usamos el método findIndex para buscar el índice de la película con el ID
    const movieIndex = movies.findIndex(movie => movie.id === id)

    // Si no se encuentra la película, devolvemos un error 404
    if (movieIndex < 0) return false

    // Actualizamos solo los campos proporcionados en el cuerpo de la solicitud y el objeto validado
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }
    return movies[movieIndex] // Devolvemos la película actualizada
  }
}
