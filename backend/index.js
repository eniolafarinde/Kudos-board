const express = require("express")
const { json } = express
const cors = require("cors")
const dotenv = require("dotenv")
const boardRoutes = require("./BoardRoutes/boardRoutes.js")

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

app.use(json())
app.use(cors())
app.use(boardRoutes)

app.listen(PORT, () => {
    console.log(`Server started o port ${PORT}`)
})