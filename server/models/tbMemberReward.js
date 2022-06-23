module.exports = (sequelize, DataTypes) => {
    const tbMemberReward = sequelize.define("tbMemberReward", {
        rewardType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tableName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tableId: {
            type: DataTypes.INTEGER,
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