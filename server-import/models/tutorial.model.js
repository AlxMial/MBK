module.exports = (sequelize, DataTypes) => {
    const Tutorial = sequelize.define("tbPointCodeDT", {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      memberId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isUse: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isExpire: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      tbPointCodeHDId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    return Tutorial;
  };