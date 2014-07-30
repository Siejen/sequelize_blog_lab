var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , env       = process.env.NODE_ENV || 'development'
  , config    = require(__dirname + '/../config/config.json')[env]
  , sequelize = new Sequelize(config.database, config.username, config.password, config)
  , db        = {}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

// Associations
db.author.hasMany(db.post   /*, { foreignKey: 'authorId' , foreignKeyConstraint:true  }*/ );
db.post.belongsTo(db.author /*, { foreignKey: 'postId'   , foreignKeyConstraint:true  }*/ );


// db.post.create({content: "Hello World"})
//   .success(function(postObj){
//     console.log("postObj: ", postObj);
//   })

// db.author.create({name: "Harper Lee"})
//   .success(function(authorObj){
//     console.log("authorObj: ", authorObj);
//   })


db.post.create({content: "Loves The Oatmeal"})
  .success(function(post) {
    
    var theAuthorId = 3;

    //db.post.findAll( { where: { authorId: theAuthorId } } ).success(function( posts ) {
      db.author.find( theAuthorId ).success(function(author){
        
        //var allPosts = posts.concat( post );
        //author.setPosts( allPosts )

        author.addPost(post)
        .success(function(author){
          console.log("Author: " + author + "Posts: " + post);
    })
  });
});

// db.post.findAll().success(function(posts){
//   console.log(post);  
//   }); 

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)