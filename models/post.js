// creating a model to interact with the database 

function Post(sequelize, DataTypes){
  return sequelize.define('post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    authorId: {
    	type: DataTypes.INTEGER,
    	foreignKey: true
    }
  });
};

module.exports = Post;
