const express = require("express")
const { json } = express
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config

const PORT = process.env.PORT || 3000