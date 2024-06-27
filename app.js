
require("dotenv").config();
const express = require('express');
const app = express();
const path = require("path");
const crypto = require('crypto');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const nocache = require('nocache');
const userRoute = require("./server/routes/userRoute");
const adminRoute = require("./server/routes/adminRoute");
const connect = require("./server/connection/connection");


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser())

app.set("views",path.join(__dirname,"views"))
app.set("view engine", "ejs");

app.use(nocache())
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.resolve(__dirname, "public/user/assets/css")));
app.use("/images", express.static(path.resolve(__dirname, "public/user/assets/images")));
app.use("/js", express.static(path.resolve(__dirname, "public/user/assets/js")));
app.use("/libs", express.static(path.resolve(__dirname, "public/user/assets/libs")));
app.use( "/", userRoute );
app.use( '/admin',adminRoute )


connect();

// 404 error handler for unmatched routes
app.use((req, res) => {
  res.status(404).render('user/error-handler', { message: 'Page not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('user/error-handler', { message: 'Something went wrong! Please try again later.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/home`);
});
