module.exports = (sequelize, DataTypes) => {
    const tb2c2p = sequelize.define("tb2c2p", {
      uid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      orderId: {
        type: DataTypes.STRING,
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
    return tb2c2p;
  };
  