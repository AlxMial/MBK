module.exports = (sequelize, DataTypes) => {
    const tbCouponCode = sequelize.define("tbCouponCode", {
      codeCoupon: {
        type: DataTypes.STRING,
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
    return tbCouponCode;
  };
  