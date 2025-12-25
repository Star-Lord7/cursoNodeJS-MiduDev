const z = require('zod') // Importa Zod para validación de esquemas

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'El Titulo debe ser una cadena de texto',
    required_error: 'El Titulo es obligatorio'
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url(),
  genre: z.array(
    z.enum(['Action', 'Crime', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Fantasy', 'Animation', 'Documentary']),
    {
      invalid_type_error: 'El género debe ser un array de cadenas de texto',
      required_error: 'El género es obligatorio'
    }
  )
})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie (input) {
  // Permite validar objetos parciales para actualizaciones opcionales usando "partial()"
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
