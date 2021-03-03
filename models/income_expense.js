'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class income_expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      income_expense.belongsTo(models.category, {
        as: 'category',
        foreignKey: 'category_id'
      });

      income_expense.belongsTo(models.user, {
        as: 'user',
        foreignKey: 'user_id'
      });
    }
  };
  income_expense.init({
    income_expense_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    concept: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    amount: {
      allowNull: false,
      type: DataTypes.DECIMAL(9, 3)
    },
    date: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    type: {
      type: DataTypes.ENUM({
        values: ['INGRESO', 'EGRESO']
      })
    },
    category_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'income_expense',
  });
  return income_expense;
};