import mysql from 'mysql2/promise'
import 'dotenv/config'

// const config = {
//   host: 'localhost',
//   user: 'root',
//   port: 3306,
//   password: '',
//   database: 'moviesdb'
// }

const config = {
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  port: process.env.MYSQL_ADDON_PORT,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  async getAll ({ genre }) {
    // if (genre) {
    //   const lowerCaseGenre = genre.toLowerCase()

    //   const [genres] = await connection.query(`
    //     SELECT id, name FROM genre WHERE LOWER(name) = ?;
    //   `, [lowerCaseGenre])
    //   if (genre.length === 0) return []

    //   const [{ id }] = genres
    // }

    const [movies] = await connection.query(`
        SELECT
            LOWER(CONCAT_WS('-',
                SUBSTR(HEX(id), 1, 8),
                SUBSTR(HEX(id), 9, 4),
                SUBSTR(HEX(id), 13, 4),
                SUBSTR(HEX(id), 17, 4),
                SUBSTR(HEX(id), 21)
            )) AS id,
            title, year, director, duration, poster, rate
        FROM movie;    
    `)
    return movies
  }

  async getById ({ id }) {
    const [movies] = await connection.query(`
        SELECT
            LOWER(CONCAT_WS('-',
                SUBSTR(HEX(id), 1, 8),
                SUBSTR(HEX(id), 9, 4),
                SUBSTR(HEX(id), 13, 4),
                SUBSTR(HEX(id), 17, 4),
                SUBSTR(HEX(id), 21)
            )) AS id,
            title, year, director, duration, poster, rate
        FROM movie WHERE id = UNHEX(REPLACE(?, '-', ''));  
    `, [id])
    if (movies.length === 0) return null
    return movies[0]
  }

  async create ({ input }) {
    const {
      // genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    await connection.query(`
      INSERT INTO movie (id, title, year, director, duration, poster, rate)
      VALUES (UNHEX(REPLACE(?, '-', '')),?,?,?,?,?,?)
    `, [uuid, title, year, director, duration, poster, rate])

    const [movies] = await connection.query(`
        SELECT
            LOWER(CONCAT_WS('-',
                SUBSTR(HEX(id), 1, 8),
                SUBSTR(HEX(id), 9, 4),
                SUBSTR(HEX(id), 13, 4),
                SUBSTR(HEX(id), 17, 4),
                SUBSTR(HEX(id), 21)
            )) AS id,
            title, year, director, duration, poster, rate
        FROM movie WHERE id = UNHEX(REPLACE(?, '-', ''));  
    `, [uuid])

    return movies[0]
  }

  async delete ({ id }) {
    const [result] = await connection.query(`
      DELETE FROM movie WHERE id = UNHEX(REPLACE(?, '-', ''));
    `, [id])
    if (result.affectedRows === 0) return false
    return true
  }

  async update ({ id, input }) {
    const fields = []
    const values = []
    for (const [key, value] of Object.entries(input)) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
    values.push(id)

    const [result] = await connection.query(`
      UPDATE movie SET ${fields.join(', ')} WHERE id = UNHEX(REPLACE(?, '-', ''));
    `, values)
    if (result.affectedRows === 0) return false

    const [movies] = await connection.query(`
        SELECT
            LOWER(CONCAT_WS('-',
                SUBSTR(HEX(id), 1, 8),
                SUBSTR(HEX(id), 9, 4),
                SUBSTR(HEX(id), 13, 4),
                SUBSTR(HEX(id), 17, 4),
                SUBSTR(HEX(id), 21)
            )) AS id,
            title, year, director, duration, poster, rate
        FROM movie WHERE id = UNHEX(REPLACE(?, '-', ''));  
    `, [id])
    return movies[0]
  }
}
