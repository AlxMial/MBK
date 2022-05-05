const express = require('express');
const app = express();
const cors = require('cors');
const initRoutes = require("./routes/tutorial.routes");
global.__basedir = __dirname + "/..";
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(cors());

const db = require('./models');

// // Routers
const SendMailRouter = require('./routes/sendmail/SendMail');
app.use("/mails",SendMailRouter);
const UsersRouter = require('./routes/register/Users');
app.use("/users",UsersRouter);
const MembersRouter = require('./routes/members/member');
app.use("/members",MembersRouter);
const pointCodeRouter = require('./routes/points/pointCode');
app.use("/pointCode",pointCodeRouter);
const pointStoreRouter = require('./routes/points/pointStore');
app.use("/pointStore",pointStoreRouter);
const pointRegisterRouter = require('./routes/points/pointRegister');
app.use("/pointRegister",pointRegisterRouter);
const uploadExcelRouter = require('./routes/uploadExcel/uploadExcel');
app.use("/uploadExcel",uploadExcelRouter);
initRoutes(app);

const port = process.env.PORT || 3001;
db.sequelize.sync().then(() =>{
    app.listen(port ,()=> {
        console.log("Server running on port 3001");
    });
});