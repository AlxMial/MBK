module.exports = (sequelize, DataTypes) => {
    const tbRedemtionConditionsHD = sequelize.define("tbRedemtionConditionsHD", {
      pointStoreName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    });
    return tbRedemtionConditionsHD;
  };
  