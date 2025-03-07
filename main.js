const e = require('express')
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

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
      "views": 200
    }]
//http://localhost:3000?title=haha
app.get('/', (req, res) => {
    console.log(req.query);
    let newPost = posts.filter(p=>!p.isDelete);
    if(req.query.title){
        newPost = newPost.filter(p=>p.title.includes(req.query.title))
    }
    if(req.query.views){
        if(req.query.views.$gte){
            newPost = newPost.filter(p=>p.views>=req.query.views.$gte)
        }else{
            newPost = newPost.filter(p=>p.views>=0)
        }
        if(req.query.views.$lte){
            newPost = newPost.filter(p=>p.views<=req.query.views.$lte)
        }else{
            newPost = newPost.filter(p=>p.views<=0)
        }
        //
    }
    res.send(newPost)
    //làm thế nào để set min và max cho URL
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
function genString(length){
    let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";
    let result ="";
    for (let index = 0; index < length; index++) {
        let rd = Math.floor(Math.random()*source.length);
        result+=source.charAt(rd);
    }
    return result;
}

app.post('/', (req, res) => {
    let newObj= {
        id:genString(16),
        title:req.body.title,
        views:req.body.views
    }
    posts.push(newObj);
    res.status(200).send(newObj)
})
app.put('/:id', (req, res) => {
    let id = req.params.id
    let post = posts.find(p=>p.id==id);
    if(post){
        post.title= req.body.title;
        post.views = req.body.views
        res.status(200).send(post)
    }else{
        res.status(404).send({message: "id khong ton tai"})
    }
})

app.delete('/:id', (req, res) => {
    let id = req.params.id
    let post = posts.find(p=>p.id==id);
    if(post){
        post.isDelete=true;
        res.status(200).send(post)
    }else{
        res.status(404).send({message: "id khong ton tai"})
    }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})