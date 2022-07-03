module.exports = (sequelize, DataTypes) => {
  const tbShop = sequelize.define("tbShop", {
    shopName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email5: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email6: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // isInactive: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: true,
    // },
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
  tbShop.associate = (models) => {
    tbShop.hasMany(models.tbBanner, {
      foreignKey: 'shopId',
      onDelete: "cascade",
    });
  };
  return tbShop;
};
