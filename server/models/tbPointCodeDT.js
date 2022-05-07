module.exports = (sequelize, DataTypes) => {
  const tbPointCodeDT = sequelize.define("tbPointCodeDT", {
    code: {
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
