// creating a model to interact with the database 

function Post(sequelize, DataTypes){
  return sequelize.define('post', {
    content: DataTypes.TEXT
  });
};

module.exports = Post;
