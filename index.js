require('dotenv').config()
const knex = require('./db')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const routes = require('./routes/index')

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(routes)

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server started on ${PORT} port`))
    } catch (e) {
        console.log(e)
    }
}

start()
