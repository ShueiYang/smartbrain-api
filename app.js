require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");

const api = require("./routes/api.v1");
const { pgStore } = require("./database/postgres");
require("./oauth/passport")

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: "GET, POST, PUT, OPTIONS, HEAD",
    credentials: true
}));

app.set('trust proxy', 1)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: "auto",
        maxAge: 1000 * 30,   //1000 * 60 * 60 * 2
        sameSite: "none",
    },
    store: pgStore,
}));

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.send("👋🌏✨🌈🦄")
});

app.use("/v1", api);


module.exports = app;