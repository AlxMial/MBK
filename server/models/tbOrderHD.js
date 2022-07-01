const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  const tbOrderHD = sequelize.define("tbOrderHD", {
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: uuidv4()

    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stockNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transportStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    couponCodeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isCancel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    isReturn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    netTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deliveryCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    discountDelivery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    discountCoupon: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    discountStorePromotion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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

    addBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updateBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transetionId: {
      type: DataTypes.STRING,
      allowNull: true,
      default: null
    }
  });
  tbOrderHD.associate = (models) => {
    tbOrderHD.hasMany(models.tbOrderDT, {
      foreignKey: "orderId",
      onDelete: "cascade",
    });
    tbOrderHD.hasMany(models.tbCancelOrder, {
      foreignKey: "orderId",
      onDelete: "cascade",
    });
    tbOrderHD.hasMany(models.tbReturnOrder, {
      foreignKey: "orderId",
      onDelete: "cascade",
    });

  };
  return tbOrderHD;
};
