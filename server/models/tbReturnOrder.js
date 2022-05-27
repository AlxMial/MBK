module.exports = (sequelize, DataTypes) => {
  const tbReturnOrder = sequelize.define("tbReturnOrder", {
    returnStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    returnDetail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
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
  return tbReturnOrder;
};
