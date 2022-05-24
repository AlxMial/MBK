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
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rewardGameCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isNotLimitRewardGame: {
        type: DataTypes.BOOLEAN,
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
    }
  );

  tbRedemptionConditionsHD.associate = (models) => {
    tbRedemptionConditionsHD.hasMany(models.tbRedemptionCoupon, {
      foreignKey: "redemtionConditionsHDId",
      onDelete: "cascade",
    });

    tbRedemptionConditionsHD.hasMany(models.tbRedemptionProduct, {
      foreignKey: "redemtionConditionsHDId",
      onDelete: "cascade",
    });
  };
  return tbRedemptionConditionsHD;
};
