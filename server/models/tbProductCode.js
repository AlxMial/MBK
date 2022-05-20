module.exports = (sequelize, DataTypes) => {
    const tbProductCode = sequelize.define("tbProductCode", {
      codeProduct: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
    return tbProductCode;
  };
  