const e = require('express')
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.use('/posts',require('./routes/posts'))
app.use('/authors',require('./routes/authors'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})