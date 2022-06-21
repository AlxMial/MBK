module.exports = (sequelize, DataTypes) => {
    const tbPermission = sequelize.define("tbPermission", {
      role:{
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
    tbPermission.associate = (models) => {
      tbPermission.hasMany(models.tbPermissionControl, {
        foreignKey: "permissionId",
        onDelete: "cascade",
      });
    }
    return tbPermission;
  };
  