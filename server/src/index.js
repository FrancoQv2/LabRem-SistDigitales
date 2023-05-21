import * as dotenv from "dotenv"
// Toma las variables configuradas por ENV dentro del docker-compose / dockerfile
// dotenv.config({ path: './.env'})
dotenv.config()

import expressServer from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"

import { dbConnection } from "./db/dbconfig.js"

import digital from "./routes/digital.routes.js"

const app = expressServer()
const PORT = process.env.SERVER_PORT || 3000

// Necesitamos body-parser para formatear los post en express
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use("/api/digital", digital)

// ---------------------------------------------------------------

// Levantamos el servidor para que escuche peticiones
app.listen(PORT, () => {
  console.log(`Server on container port ${PORT}`)
  console.log(`Server on localhost port ${process.env.LOCALHOST_PORT}`)
  // console.log("----------------------")
})

export function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time))
} 

export const db = dbConnection
