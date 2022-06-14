module.exports = (sequelize, DataTypes) => {
    const tbCouponCode = sequelize.define("tbCouponCode", {
      codeCoupon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isUse: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      redemptionCouponId:{
        type: DataTypes.INTEGER,
        allowNull: false,
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
    return tbCouponCode;
  };