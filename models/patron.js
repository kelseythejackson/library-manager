'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    library_id: DataTypes.STRING,
    zip_code: DataTypes.INTEGER
  }, {
      timestamps: false,
      underscored: true
  });
  Patron.associate = function(models) {
    // associations can be defined here
    models.Patron.hasMany(models.Loan);
   
  };
  return Patron;
};