const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const MY_SECRET_KEY = "My_Strong_Secret_Key";

app.use(express.json());

app.use("/customer", session({secret: MY_SECRET_KEY, resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) {
        const token = req.session.authorization['accessToken'];
       jwt.verify(token, MY_SECRET_KEY, (err, user) => {
            console.log("Error JWT : ", err);
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }
       });
    } else {
        return res.status(401).json({
            message: "Missing access Token"
        });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
