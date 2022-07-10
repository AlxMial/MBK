module.exports = (sequelize, DataTypes) => {
    const tbPromotionStore = sequelize.define("tbPromotionStore", {
      campaignName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buy: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      discount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
      },
      percentDiscount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
      },
      percentDiscountAmount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
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
    return tbPromotionStore;
  };
  