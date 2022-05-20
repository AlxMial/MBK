module.exports = (sequelize, DataTypes) => {
    const tbOrderDT = sequelize.define("tbOrderDT", {
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
    return tbOrderDT;
  };
  