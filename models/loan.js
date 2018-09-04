'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: DataTypes.STRING,
    patron_id: DataTypes.STRING,
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: 'loan date cannot be empty'
        },
        isDate: {
          msg: "Date published is can only be the year (YYYY-MM-DD)"
        }
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: "Date published is can only be the year (YYYY-MM-DD)"
        },
        notEmpty: {
          msg: 'return by date cannot be empty'
        }
      }
    },
    returned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: 'returned on date cannot be empty'
        },
        isDate: {
          msg: "Date published is can only be the year (YYYY-MM-DD)"
        }
      }
    }
  }, {
      timestamps: false,
      underscored: true
  });
  Loan.associate = function(models) {
    // associations can be defined here
      models.Loan.belongsTo(models.Book);
      models.Loan.belongsTo(models.Patron);
  };
  return Loan;
};