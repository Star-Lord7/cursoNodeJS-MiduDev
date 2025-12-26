import { Router } from 'express'
import { MovieController } from '../controllers/moviesController.js'

const router = Router()

router.get('/', MovieController.getAll)

// Ruta para obtener una película por su ID
router.get('/:id', MovieController.getById)

// Ruta para crear una nueva película
router.post('/', MovieController.create)

// Ruta para actualizar una película por su ID
router.patch('/:id', MovieController.update)

// Ruta para eliminar una película por su ID
router.delete('/:id', MovieController.delete)

export default router
