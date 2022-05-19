module.exports = (sequelize, DataTypes) => {
    const tbRedemptionProduct = sequelize.define("tbRedemptionProduct", {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rewardCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isNoLimitReward: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      addBy:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      updateBy:{
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
    return tbRedemptionProduct;
  };
  