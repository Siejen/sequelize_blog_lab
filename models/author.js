// creating a model to interact with the database 

function Author(sequelize, DataTypes){
  return sequelize.define('author', {
    name: DataTypes.STRING
  });
};

module.exports = Author;
