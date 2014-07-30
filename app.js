var express = require("express"),
	bodyParser = require('body-parser'),
  	db = require("./models/index.js"),
  	app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());

app.get("/blog", function(req, res){
  db.post.findAll().success(function(posts){
    res.render('blog', {posts: posts})
  })
})

app.get("/newpost", function(req, res){
   res.render('newpost', {})
})

app.post("/newpost", function(req, res){
	db.post.create({content: req.body.content})
  	.success(function(post) {
    
    var theAuthorId = 3;
      db.author.find( theAuthorId ).success(function(author){        
        author.addPost(post)
        .success(function(author){
          console.log("Author: " + author + "Posts: " + post);
    })
  });
});

	console.log(req.body);
   	res.redirect('/blog');
})


app.listen(3000, function(){
  console.log("SERVER listening on 3000")
})