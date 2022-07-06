module.exports = (sequelize, DataTypes) => {
  const tbPointCodeDT = sequelize.define("tbPointCodeDT", {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codeNone: {
      type: DataTypes.STRING,
      allowNull: true,
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
  });
  return tbPointCodeDT;
};
