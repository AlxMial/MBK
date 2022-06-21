module.exports = (sequelize, DataTypes) => {
    const tbPermissionControl = sequelize.define("tbPermissionControl", {
      controlName:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      isEnable:{
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

    return tbPermissionControl;
  };
  