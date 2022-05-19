module.exports = (sequelize, DataTypes) => {
    const tbRedemtionConditionsHD = sequelize.define("tbRedemtionConditionsHD", {
      campaignName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      campaignType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rewardGameCount:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isNotLimitRewardGame:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      description:{
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isDeleted:{
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
    return tbRedemtionConditionsHD;
  };
  