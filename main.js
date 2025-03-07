const express = require('express')
const app = express()
const port = 3000

let posts = [
    {
      "id": "1",
      "title": "a title",
      "views": 100
    },
    {
      "id": "2",
      "title": "another title",
      "views": 200
    },
    {
      "id": "3",
      "title": "another haha",
      "views": 200,
      "isDelete": true
    }]

app.get('/', (req, res) => {
  res.send(posts)
})
app.get('/:id', (req, res) => {
    let id = req.params.id
    let post = posts.find(p=>p.id==id);
    if(post){
        res.status(200).send(post)
    }else{
        res.status(404).send({message: "id khong ton tai"})
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})