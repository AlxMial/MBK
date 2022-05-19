module.exports = (sequelize, DataTypes) => {
    const tbPointStoreHD = sequelize.define("tbPointStoreHD", {
      pointStoreName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    });

    tbPointStoreHD.associate = (models) => {
      tbPointStoreHD.hasMany(models.tbPointStoreDT, {
        onDelete: "cascade",
      });
    };
    return tbPointStoreHD;
  };
  