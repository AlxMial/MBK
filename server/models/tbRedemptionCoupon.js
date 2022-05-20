module.exports = (sequelize, DataTypes) => {
    const tbRedemptionCoupon = sequelize.define("tbRedemptionCoupon", {
      couponName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiredDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      couponCount:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isNotExpired:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      usedPerDayCount:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description:{
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isCancelReclaim:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isCancel:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isReclaim:{
        type: DataTypes.BOOLEAN,
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

    tbRedemptionCoupon.associate = (models) => {
      tbRedemptionCoupon.hasMany(models.tbCouponCode, {
        foreignKey: 'redemptionCouponId',
        onDelete: "cascade",
      });
    };
    return tbRedemptionCoupon;
  };
  