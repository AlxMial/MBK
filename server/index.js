const express = require('express');
const app = express();
const cors = require('cors');
const initRoutes = require("./routes/tutorial.routes");
const ValidateEncrypt = require("./services/crypto")
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const YAML = require('yamljs');

global.__basedir = __dirname + "/..";
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

function authentication(req, res, next) {
    var authheader = req.headers.authorization;
    if (req.originalUrl.includes("/getImgQrCode/") || req.originalUrl.includes("/2c2p")) {
        next();
    } else {


        if (!authheader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return res.status(401).json({ status: 401, message: 'You are not authenticated!' })
        }
        var auth = new Buffer.from(authheader.split(' ')[1],
            'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        const encrypt = new ValidateEncrypt();
        if (user == encrypt.EncodeKey('administrator') && pass == encrypt.EncodeKey('asujimuser')) {
            // If Authorized user
            next();
        } else {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return res.status(401).json({ status: 401, message: 'You are not authenticated!' })
        }
    }

}
const swaggerDocument = YAML.load('swagger.yaml');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// 2c2p
const paymentRouter = require('./routes/2c2p/index');
app.use("/mahboonkrongserver/2c2p", paymentRouter);

// app.use(authentication)
const db = require('./models');
// // Routers
// Menu
const MenuRouter = require('./routes/menu/menu');
app.use("/mahboonkrongserver/menus", MenuRouter);
//Permission
const PermissionRouter = require('./routes/permission/permission');
app.use("/mahboonkrongserver/permission", PermissionRouter);
//email
const SendMailRouter = require('./routes/sendmail/SendMail');
app.use("/mahboonkrongserver/mails", SendMailRouter);
const UsersRouter = require('./routes/register/Users');
app.use("/mahboonkrongserver/users", UsersRouter);
const MembersRouter = require('./routes/members/member');
app.use("/mahboonkrongserver/members", MembersRouter);
const pointCodeRouter = require('./routes/points/pointCode');
app.use("/mahboonkrongserver/pointCode", pointCodeRouter);
const pointStoreRouter = require('./routes/points/pointStore');
app.use("/mahboonkrongserver/pointStore", pointStoreRouter);
const pointRegisterRouter = require('./routes/points/pointRegister');
app.use("/mahboonkrongserver/pointRegister", pointRegisterRouter);
const pointEcommerceRouter = require('./routes/points/pointEcommerce');
app.use("/mahboonkrongserver/pointEcommerce", pointEcommerceRouter);
const uploadExcelRouter = require('./routes/uploadExcel/uploadExcel');
app.use("/mahboonkrongserver/uploadExcel", uploadExcelRouter);
const redeemRouter = require('./routes/redeem/redeem');
app.use("/mahboonkrongserver/redeem", redeemRouter);
const redemptionRouter = require('./routes/redemption/redemption');
app.use("/mahboonkrongserver/redemptions", redemptionRouter);
const MemberPointRouter = require('./routes/members/MemberPoint');
app.use("/mahboonkrongserver/memberPoint", MemberPointRouter);
// e-commerce
const shop = require('./routes/ecommerce/shop');
app.use("/mahboonkrongserver/shop", shop);
const banner = require('./routes/ecommerce/banner');
app.use("/mahboonkrongserver/banner", banner);
const stock = require('./routes/ecommerce/stock');
app.use("/mahboonkrongserver/stock", stock);
const productCategory = require('./routes/ecommerce/productCategory');
app.use("/mahboonkrongserver/productCategory", productCategory);
const logisticCategory = require('./routes/ecommerce/logisticCategory');
app.use("/mahboonkrongserver/logisticCategory", logisticCategory);
const payment = require('./routes/ecommerce/payment');
app.use("/mahboonkrongserver/payment", payment);
const orderHD = require('./routes/ecommerce/order/orderHD');
app.use("/mahboonkrongserver/order/orderHD", orderHD);
const orderDT = require('./routes/ecommerce/order/orderDT');
app.use("/mahboonkrongserver/order/orderDT", orderDT);
const cancelOrder = require('./routes/ecommerce/cancelOrder');
app.use("/mahboonkrongserver/cancelOrder", cancelOrder);
const returnOrder = require('./routes/ecommerce/returnOrder');
app.use("/mahboonkrongserver/returnOrder", returnOrder);
// tab Logistic
const logistic = require('./routes/ecommerce/logistic');
app.use("/mahboonkrongserver/logistic", logistic);
const promotionDelivery = require('./routes/ecommerce/promotionDelivery');
app.use("/mahboonkrongserver/promotionDelivery", promotionDelivery);
// tab promotion หน้าร้าน
const promotionStore = require('./routes/ecommerce/promotionStore');
app.use("/mahboonkrongserver/promotionStore", promotionStore);
const image = require('./routes/image/image');
app.use("/mahboonkrongserver/image", image);
const pointHistoryReport = require('./routes/report/Report');
app.use("/mahboonkrongserver/report", pointHistoryReport);
initRoutes(app);

const port = process.env.PORT || 3001;
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server running on port 3001");
    });
});