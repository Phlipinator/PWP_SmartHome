import express from 'express'

import path from 'path'

const app = express()

app.use(express.static(path.join(__dirname, '../output_to_host')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../output_to_host', 'index.html'))
})

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})
