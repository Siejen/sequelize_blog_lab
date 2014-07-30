var express = require("express"),
  db = require("./models/index.js"),
  app = express();

app.set("view engine", "ejs");

app.get("/blog", function(req, res){
  db.post.findAll().success(function(posts){
    res.render('blog', {posts: posts})
  })
})

app.listen(3000, function(){
  console.log("SERVER listening on 3000")
})