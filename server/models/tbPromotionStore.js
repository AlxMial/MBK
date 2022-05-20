module.exports = (sequelize, DataTypes) => {
    const tbPromotionStore = sequelize.define("tbPromotionStore", {
      campaignName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      percentDiscount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      percentDiscountAmount: {
        type: DataTypes.INTEGER,
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
  