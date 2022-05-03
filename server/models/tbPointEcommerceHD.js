module.exports = (sequelize, DataTypes) => {
    const tbPointEcommerceHD = sequelize.define("tbPointEcommerceHD", {
      pointEcommerceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isSale: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      pointEcommercePrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pointEcommerceQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pointEcommerceCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    });
    return tbPointEcommerceHD;
  };
  