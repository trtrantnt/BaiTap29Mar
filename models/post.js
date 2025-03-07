let Gen = require("../Utils/generate")

let Post = function(title,views){
    this.Id = Gen.genS(16),
    this.title = title;
    this.views= views;
}

module.exports = Post