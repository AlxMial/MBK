module.exports = (sequelize, DataTypes) => {
  const tbMember = sequelize.define("tbMember", {
    memberCard: {
      type: DataTypes.STRING,
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
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registerDate: {
      type: DataTypes.DATE,
      allowNull: false,
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
    postcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isMemberType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    memberPoint: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    memberPointExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    memberType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    consentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  });

  tbMember.associate = (models) => {
    tbMember.hasMany(models.tbMemberPoint, {
      onDelete: "cascade",
    });
    tbMember.hasMany(models.tbOrderHD, {
      foreignKey: "memberId",
      onDelete: "cascade",
    });
    tbMember.hasMany(models.tbMemberReward, {
      foreignKey: "memberId",
      onDelete: "cascade",
    });
  };
  return tbMember;
};