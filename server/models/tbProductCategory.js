module.exports = (sequelize, DataTypes) => {
  const tbProductCategory = sequelize.define("tbProductCategory", {
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
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
  tbProductCategory.associate = (models) => {
    tbProductCategory.hasMany(models.tbStock, {
      foreignKey: 'productCategoryId',
      onDelete: "cascade",
    });
    tbProductCategory.hasMany(models.tbBanner, {
      foreignKey: 'productCategoryId',
      onDelete: "cascade",
    });
  };
  return tbProductCategory;
};
