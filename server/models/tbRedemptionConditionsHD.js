module.exports = (sequelize, DataTypes) => {
  const tbRedemptionConditionsHD = sequelize.define(
    "tbRedemptionConditionsHD",
    {
      redemptionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      redemptionType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rewardType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rewardGameAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      couponType: {
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
    }
  );

  tbRedemptionConditionsHD.associate = (models) => {
    tbRedemptionConditionsHD.hasMany(models.tbRedemptionCoupon, {
      foreignKey: "redemptionConditionsHDId",
      onDelete: "cascade",
    });

    tbRedemptionConditionsHD.hasMany(models.tbRedemptionProduct, {
      foreignKey: "redemptionConditionsHDId",
      onDelete: "cascade",
    });
  };
  return tbRedemptionConditionsHD;
};
