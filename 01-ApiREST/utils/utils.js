/** Leemos un JSON con "require" usando "createRequire" para importar módulos CommonJS en un entorno ES Modules */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)
