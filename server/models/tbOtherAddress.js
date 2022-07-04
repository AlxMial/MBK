module.exports = (sequelize, DataTypes) => {
    const tbOtherAddress = sequelize.define("tbOtherAddress", {
        memberID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        subDistrict: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        province: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ListNo: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        postcode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },

    });
    tbOtherAddress.associate = (models) => {
        tbOtherAddress.hasMany(models.tbOrderHD, {
            foreignKey: "otherAddressId",
            onDelete: "cascade",
        });
    }
    return tbOtherAddress;
};