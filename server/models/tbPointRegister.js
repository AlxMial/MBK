module.exports = (sequelize, DataTypes) => {
    const tbPointRegister = sequelize.define("tbPointRegister", {
      pointRegisterScore: {
        type: DataTypes.STRING,
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

    return tbPointRegister;
  };
  