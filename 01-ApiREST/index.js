import { createApp } from './app.js'
import { MovieModel } from './models/mysql/movieModel.js'

const movieModel = new MovieModel()

createApp({ movieModel })
