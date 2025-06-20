const express = require("express")
const { json } = express
const cors = require("cors")
const dotenv = require("dotenv")
const boardRoutes = require("./BoardRoutes/boardRoutes.js")
const cardRoutes = require("./CardRoutes/cardRoutes.js")
const commentRoutes = require("./CommentRoutes/commentRoutes.js")

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

app.use(json())
app.use(cors())
app.use(boardRoutes);
app.use(cardRoutes);
app.use(commentRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})