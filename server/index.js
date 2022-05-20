const express = require('express');
const app = express();
const cors = require('cors');
const initRoutes = require("./routes/tutorial.routes");
const ValidateEncrypt = require("./services/crypto")
global.__basedir = __dirname + "/..";
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

function authentication(req, res, next) {
    var authheader = req.headers.authorization;
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
app.use(authentication)

const db = require('./models');

// // Routers
const SendMailRouter = require('./routes/sendmail/SendMail');
app.use("/mbkserver/mails", SendMailRouter);
const UsersRouter = require('./routes/register/Users');
app.use("/mbkserver/users", UsersRouter);
const MembersRouter = require('./routes/members/member');
app.use("/mbkserver/members", MembersRouter);
const pointCodeRouter = require('./routes/points/pointCode');
app.use("/mbkserver/pointCode", pointCodeRouter);
const pointStoreRouter = require('./routes/points/pointStore');
app.use("/mbkserver/pointStore", pointStoreRouter);
const pointRegisterRouter = require('./routes/points/pointRegister');
app.use("/mbkserver/pointRegister", pointRegisterRouter);
const uploadExcelRouter = require('./routes/uploadExcel/uploadExcel');
app.use("/mbkserver/uploadExcel", uploadExcelRouter);
const redeemRouter = require('./routes/redeem/redeem');
app.use("/mbkserver/redeem", redeemRouter);
const shop = require('./routes/settingShop/shop');
app.use("/mbkserver/shop", shop);
const banner = require('./routes/settingShop/banner');
app.use("/mbkserver/banner", banner);
initRoutes(app);

const port = process.env.PORT || 3001;
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server running on port 3001");
    });
});