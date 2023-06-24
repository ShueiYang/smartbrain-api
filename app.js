require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");

const api = require("./routes/api.v1");
const { pgStore } = require("./database/postgres");
require("./oauth/passport")

const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL,
    methods: "GET, POST, PUT, DELETE, OPTIONS, HEAD",
    credentials: true,
};

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));

app.set('trust proxy', 1)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: "auto",
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none"
    },
    store: pgStore,
}));

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.send("👋🌏✨🌈🦄")
});

app.use("/v1", api);

app.all("*", (req, res) => {
    res.status(404).json({ message: "This route does not exist" });
});

module.exports = app;