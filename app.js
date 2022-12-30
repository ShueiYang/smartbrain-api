require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");

const api = require("./routes/api.v1");
require("./oauth/passport")

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET, POST, PUT, DELETE",
    credentials: true
}));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 2 }
}));

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.send("👋🌏✨🌈🦄")
});

app.use("/v1", api);


module.exports = app;