module.exports = (sequelize, DataTypes) => {
    const tbPointStoreDT = sequelize.define("tbPointStoreDT", {
      pointBranchName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    });
    return tbPointStoreDT;
  };
  