'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'First name is required'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Last name is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Address is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'email is required'
        },
        isEmail: {
          args: [true],
          msg: 'must be an email'
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Library is required'
        },
        len: {
          args: [7],
          msg: 'ID must be 7 characters'
        }
      }
    },
    zip_code: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Zip Code is required'
        },
        not: {
          args: ["[a-z]",'i'],
          msg: 'zip-code can only be letters'
        }
      }
    }
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