const URL = "http://localhost:3000/posts";
var global;

LoadSync();
function Load(){
    fetch(URL).then(function(res){
        return res.json();
    }).then(function(data){
        console.log(data);
    })
}
async function LoadSync(){
    let res = await fetch(URL);
    let posts = await res.json();
    posts = posts.filter(p=>!p.isDelete)
    global = posts;
    let body = document.getElementById("body");
    body.innerHTML=""
    for (const post of posts) {
        body.innerHTML+=ConvertFromObjToHTML(post);
    }
}
function ConvertFromObjToHTML(post){
    let string = "<tr>";
    string+=`<td>${post.id}</td>`;
    string+=`<td>${post.title}</td>`;
    string+=`<td>${post.views}</td>`;
    string+=`<td><button onclick="Delete(${post.id});return false;">Delete</button></td>`
    string+="</tr>";
    return string;
}

function CheckExist(id){
    let post = global.find(p=>p.id==id);
    return typeof post != 'undefined';
}

function getMax(){
    let ids = global.map(p=>Number.parseInt(p.id));
    return Math.max(...ids);
}
function Save(){
    let id = document.getElementById("id").value;
    if(id.length==0||isNaN(id)){
        id = (getMax()+1)+"";
    }
    let obj = {
        id:id,
        title:document.getElementById("title").value,
        views:document.getElementById("views").value
    }
    if(CheckExist(id)){
        //edit
        fetch(URL+"/"+id,{
            method:"PUT",
            body:JSON.stringify(obj),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(function(){
            LoadSync();
        })
    }else{
        //create
        fetch(URL,{
            method:"POST",
            body:JSON.stringify(obj),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(function(){
            LoadSync();
        })
    } 
}
function Delete(id){
    let obj = global.find(p=>p.id==id);
    if(typeof obj!='undefined'){
        obj.isDelete = true;
        fetch(URL+"/"+id,{
            method:"PUT",
            body:JSON.stringify(obj),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(function(){
            LoadSync();
        })
    }
    
}

