module.exports = (sequelize, DataTypes) => {
  const tbStock = sequelize.define("tbStock", {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    percent: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    discountType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriptionPromotion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isFlashSale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    startDateCampaign: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDateCampaign: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    startTimeCampaign: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    endTimeCampaign: {
      type: DataTypes.TIME,
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
    isBestSeller: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    salePercent: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    saleDiscount: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
  });
  tbStock.associate = (models) => {
    tbStock.hasMany(models.tbBanner, {
      foreignKey: "stockId",
      onDelete: "cascade",
    });
    tbStock.hasMany(models.tbPointEcommerce, {
      foreignKey: "stockId",
      onDelete: "cascade",
    });
    tbStock.hasMany(models.tbPromotionStore, {
      foreignKey: "stockId",
      onDelete: "cascade",
    });
    tbStock.hasMany(models.tbOrderDT, {
      foreignKey: "stockId",
      onDelete: "cascade",
    });
    tbStock.hasMany(models.tbCartDT, {
      foreignKey: "strockId",
      onDelete: "cascade",
    });
  };
  return tbStock;
};
