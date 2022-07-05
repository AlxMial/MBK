module.exports = (sequelize, DataTypes) => {
  const tbLogisticCategory = sequelize.define("tbLogisticCategory", {
    logisticCategory: {
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

//   tbLogisticCategory.associate = (models) => {
//     tbLogisticCategory.hasMany(models.tbLogistic, {
//       foreignKey: "logisticCategoryId",
//       onDelete: "cascade",
//     });
//   };
  return tbLogisticCategory;
};
