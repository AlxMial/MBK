module.exports = (sequelize, DataTypes) => {
    const tbCartDT = sequelize.define("tbCartDT", {
        carthdId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        strockId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            default: 0
        },

    });
    return tbCartDT;
};
