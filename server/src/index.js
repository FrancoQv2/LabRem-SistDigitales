import * as dotenv from "dotenv"
// Toma las variables configuradas por ENV dentro del docker-compose / dockerfile
// dotenv.config({ path: './.env'})
dotenv.config()

import expressServer from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"

import https from "https"
import fs from "fs"
import { fileURLToPath } from "url"
import path from "path"

import { dbConnection } from "./configs/db.config.js"

import digital from "./routes/digital.routes.js"

import fileUpload from "express-fileupload"

// Configuracion de https
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const options = {
//     key: fs.readFileSync(__dirname + "/certs/privkey.pem","ascii"),
//     cert: fs.readFileSync(__dirname +"/certs/cert.pem","ascii")
// }

const app = expressServer()
const PORT = 3000

// Necesitamos body-parser para formatear los post en express
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use("/api/digital", digital)

const __dirname = path.resolve()
app.use(fileUpload())
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.')
  }

  console.log(req.files)
  const uploadedFile = req.files.file
  const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name) // Debe existir previamente el directorio
  
  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    res.send('File uploaded!')
  })
})

// ---------------------------------------------------------------

// const server = https.createServer(options, app)

// server.listen(PORT, () => {
//   console.log(`LabRem Digital - Server on ${PORT}`)
// })

app.listen(PORT, () => {
  console.log(`LabRem Digital - Server on ${PORT}`)
})

export const db = dbConnection
