module.exports = (sequelize, DataTypes) => {
    const tbPointEcommerce = sequelize.define("tbPointEcommerce", {
      campaignName:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      type:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      purchaseAmount:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      productAmount:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      points:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startDate:{
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate:{
        type: DataTypes.DATE,
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
    return tbPointEcommerce;
  };
  