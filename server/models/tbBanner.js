module.exports = (sequelize, DataTypes) => {
    const tbBanner = sequelize.define("tbBanner", {
      TypeLink: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      addBy:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      updateBy:{
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
    return tbBanner;
  };
  