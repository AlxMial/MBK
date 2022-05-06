module.exports = (sequelize, DataTypes) => {
    const tbMember = sequelize.define("tbMember", {
      memberCard: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      registerDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
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
      postcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      uid:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sex:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      isMemberType:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      memberPoint:{
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    });
    return tbMember;
  };