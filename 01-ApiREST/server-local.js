import { createApp } from './app.js'
import { MovieModel } from './models/local/movieModel.js'

// Le pasamos el modelo local a la aplicación para usar inyección de dependencias
createApp({ movieModel: MovieModel })
