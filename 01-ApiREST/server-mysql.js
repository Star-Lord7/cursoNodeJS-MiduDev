import { createApp } from './app.js'
import { MovieModel } from './models/mysql/movieModel.js'

// Le pasamos el modelo de MySQL a la aplicación para usar inyección de dependencias
createApp({ movieModel: MovieModel })
