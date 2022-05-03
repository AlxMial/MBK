module.exports = (sequelize, DataTypes) => {
    const tbPointEcommerceDT = sequelize.define("tbPointEcommerceDT", {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pointEcommerceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      memberId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isUse: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    });
    return tbPointEcommerceDT;
  };
  