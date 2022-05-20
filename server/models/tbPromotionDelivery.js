module.exports = (sequelize, DataTypes) => {
    const tbPromotionDelivery = sequelize.define("tbPromotionDelivery", {
      promotionName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deliveryCost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isInactive: {
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
    return tbPromotionDelivery;
  };
  