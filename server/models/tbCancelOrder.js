module.exports = (sequelize, DataTypes) => {
  const tbCancelOrder = sequelize.define("tbCancelOrder", {
    cancelStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cancelDetail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancelType: {
      type: DataTypes.STRING,
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
  return tbCancelOrder;
};
