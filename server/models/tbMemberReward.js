module.exports = (sequelize, DataTypes) => {
    const tbMemberReward = sequelize.define("tbMemberReward", {
        rewardType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        TableHDId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       
        redeemDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isUsedCoupon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deliverStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trackingNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });

    return tbMemberReward;
};