'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: DataTypes.STRING,
    patron_id: DataTypes.STRING,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
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