import { Router } from 'express'
import { MovieController } from '../controllers/moviesController.js'

// Creamos una función para crear el router de películas
export const createMovieRouter = ({ movieModel }) => {
  const router = Router()

  // Creamos una instancia del controlador de películas
  const movieController = new MovieController({ movieModel })

  router.get('/', movieController.getAll)

  // Ruta para obtener una película por su ID
  router.get('/:id', movieController.getById)

  // Ruta para crear una nueva película
  router.post('/', movieController.create)

  // Ruta para actualizar una película por su ID
  router.patch('/:id', movieController.update)

  // Ruta para eliminar una película por su ID
  router.delete('/:id', movieController.delete)

  return router
}
