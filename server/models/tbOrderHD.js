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
