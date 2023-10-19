const express = require('express')
const app = express()
const port = 5000
const fileUpload = require('express-fileupload')
const path = require('path')

app.use(fileUpload())

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.')
  }

  const uploadedFile = req.files.file
  const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name)

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err)
    }

    res.send('File uploaded!')
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})