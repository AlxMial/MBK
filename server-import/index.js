const express = require('express');
const app = express();
const cors = require('cors');
const initRoutes = require("./routes/tutorial.routes");
const ValidateEncrypt = require("./services/crypto")
global.__basedir = __dirname + "/..";
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(cors());


function authentication(req, res, next) {
    var authheader = req.headers.authorization;
    if (!authheader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    }
 
    var auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    const encrypt =  new ValidateEncrypt();
    if (user ==encrypt.EncodeKey('administrator') && pass == encrypt.EncodeKey('asujimuser')) {
        // If Authorized user
        next();
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
 
}
app.use(authentication)

const db = require('./models');

// // Routers
initRoutes(app);

const port = process.env.PORT || 3002;
db.sequelize.sync().then(() =>{
    app.listen(port ,()=> {
        console.log("Server running on port 3002");
    });
});