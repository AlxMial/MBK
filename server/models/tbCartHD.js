module.exports = (sequelize, DataTypes) => {
    const tbCartHD = sequelize.define("tbCartHD", {
        uid: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    });
    tbCartHD.associate = (models) => {
        tbCartHD.hasMany(models.tbCartDT, {
            foreignKey: "carthdId",
            onDelete: "cascade",
        });
    };
    return tbCartHD;
};
