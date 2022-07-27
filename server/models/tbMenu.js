module.exports = (sequelize, DataTypes) => {
  const tbMenu = sequelize.define("tbMenu", {
    module: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  tbMenu.associate = (models) => {
    tbMenu.hasMany(models.tbPermission, {
      foreignKey: "menuId",
      onDelete: "cascade",
    });
  };
  return tbMenu;
};
