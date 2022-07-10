module.exports = (sequelize, DataTypes) => {
    const tbMemberPoint = sequelize.define("tbMemberPoint", {
      campaignType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      redeemDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expireDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      pointsStoreHdId:{
        type: DataTypes.INTEGER,
        allowNull:true
      },
      pointsStoreDtId:{
        type: DataTypes.INTEGER,
        allowNull:true
      }
    });
    return tbMemberPoint;
  };