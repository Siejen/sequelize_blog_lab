var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),
  flash = require("connect-flash"),
  app = express(),
  db = require("./models/index");


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}) ); 

//////

app.use(cookieSession({
  secret: 'thisismysecretkey',
  name: 'cookie created by Siejen',
  //maxage is in milliseconds
  maxage: 360000
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare our serialize functions
passport.serializeUser(function(author,done){         // Serialize and deserialize will run independently on its own
  done(null, author.id);
});

// a tiny query to see if our author/id is still in the database
passport.deserializeUser(function(id,done){
  db.author.find({
    where: {
      id: id
    }
  }).done(function(error, author){
    done(error, author);
  });
});

app.get('/', function(req,res){
  // check if the author is logged in
  if(!req.author) {
    res.render("blog");    
  }
  else {
    res.redirect('/newpost');
  }
});

app.get('/signup', function(req,res){
  if(!req.author) {
    res.render("signup",{username: ""});
  }
  else{
    res.redirect('/home');
  }
});

app.get('/login', function(req,res){
  if(!req.author) {
    res.render("login");
  }
  else {
    res.redirect('/home');
  }
});

app.get('/home', function(req,res){
  res.render("home", {
    isAuthenticated: req.isAuthenticated(),     // isAuthenticated is a passport function
    author: req.author 
  });
});
// on submit, create a new authors using form values
app.post('/create', function(req,res){  
    db.author.create({content: req.body.content})
    .success(function(author) {

  db.author.createNewAuthor(req.body.username, req.body.password, 
  function(err){
    res.render("signup", {message: err.message, username: req.body.username});
  }, 
  function(success){
    res.render("index", {message: success.message});
  });
});
});

// authenticate authors when logging in
// app.post('/login', passport.authenticate('local', {
//  successRedirect: '/home',
//  failureRedirect: '/foo',
//  failureFlash: true,   
// }));

app.post('/login', passport.authenticate('local', { 
  successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
    })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//////

app.get("/blog", function(req, res){
  db.post.findAll().success(function(posts){
  	db.author.findAll().success(function(authors){
 		console.log(authors[0].dataValues.name);
 		res.render('blog', {posts: posts, authors: authors}) 		
  	})
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