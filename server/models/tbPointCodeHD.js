module.exports = (sequelize, DataTypes) => {
  const tbPointCodeHD = sequelize.define("tbPointCodeHD", {
    pointCodeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pointCodeSymbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pointCodeLengthSymbol: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pointCodePoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pointCodeQuantityCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
  return tbPointCodeHD;
};
