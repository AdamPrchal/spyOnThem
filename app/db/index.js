const { Pool } = require('pg')
const pool = new Pool({
    user: 'pinkAdmin',
    host: 'postgres',
    database: 'spyOnThem',
    password: 'onTheRainbow',
    port: 5432,
  })
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}