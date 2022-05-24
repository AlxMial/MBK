module.exports = (sequelize, DataTypes) => {
  const tbOrderHD = sequelize.define("tbOrderHD", {
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stockNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transportStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCancel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isReturn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
  });
  tbOrderHD.associate = (models) => {
    tbOrderHD.hasMany(models.tbOrderDT, {
      foreignKey: "orderId",
      onDelete: "cascade",
    });
    tbOrderHD.hasMany(models.tbCancelOrder, {
      foreignKey: "orderId",
      onDelete: "cascade",
    });
    tbOrderHD.hasMany(models.tbReturnOrder, {
      foreignKey: "orderId",
      onDelete: "cascade",
    });
  };
  return tbOrderHD;
};
