'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title is required"
        },
        len: {
          args: [2],
          msg: "Title must be longer than two characters"
        }
      }
      
    },
    author: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required"
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Genre is required"
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        not: {
          args: ["[a-z]",'i'],
          msg: 'Only Numeric characters allowed'
        },
        len: {
          args: [0, 4],
          msg: "The date can be 4 numbers max"
        }
      }
      
    }
  }, {
      timestamps: false,
      underscored: true
  });
  Book.associate = function(models) {
    // associations can be defined here
      models.Book.hasMany(models.Loan);
      
  };
  return Book;
};