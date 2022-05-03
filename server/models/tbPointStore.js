module.exports = (sequelize, DataTypes) => {
    const tbPointStore = sequelize.define("tbPointStore", {
      pointStoreName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    });
    return tbPointStore;
  };
  