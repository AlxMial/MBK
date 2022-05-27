module.exports = (sequelize, DataTypes) => {
  const tbOrderDT = sequelize.define("tbOrderDT", {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    addBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updateBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    discountType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return tbOrderDT;
};
