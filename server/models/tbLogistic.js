module.exports = (sequelize, DataTypes) => {
  const tbLogistic = sequelize.define("tbLogistic", {
    logisticType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryCost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isShow: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    logisticCategoryId: {
      type: DataTypes.INTEGER,
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

  tbLogistic.associate = (models) => {
    tbLogistic.hasMany(models.tbOrderHD, {
      foreignKey: "logisticId",
      onDelete: "cascade",
    });
  };
  return tbLogistic;
};
