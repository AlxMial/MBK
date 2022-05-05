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
initRoutes(app);

const port = process.env.PORT || 3002;
db.sequelize.sync().then(() =>{
    app.listen(port ,()=> {
        console.log("Server running on port 3002");
    });
});