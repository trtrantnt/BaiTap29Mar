var express = require('express');
let router = express.Router()

let posts = require('../data/posts')
let Post = require('../models/post')

router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
    let id = req.params.id
    let post = posts.find(p=>p.id==id);
    if(post){
        res.status(200).send(post)
    }else{
        res.status(404).send({message: "id khong ton tai"})
    }
})

router.post('/', (req, res) => {
    let newObj= new Post(req.body.title,req.body.views);
    posts.push(newObj);
    res.status(200).send(newObj)
})
router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
    let id = req.params.id
    let post = posts.find(p=>p.id==id);
    if(post){
        post.isDelete=true;
        res.status(200).send(post)
    }else{
        res.status(404).send({message: "id khong ton tai"})
    }
})
module.exports=router;