require('dotenv').config();
const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const helmet = require("helmet");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const session = require('express-session');

const { handleRegister } = require('./controllers/register');
const { handleSignin } = require('./controllers/signin');
const { handleGoogleProfile } = require('./controllers/auth.profile');
const { handleApiCall, handleImage } = require('./controllers/image');


const database = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
          }
    }
});

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true
}));

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
};

app.use(session({
    secret: config.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 2 }
}));


 async function verifiyCallback(accessToken, refreshToken, profile, done) {
    try{
        await database.transaction(async trx => {
            const result = await trx("oauth").where("profile_id", "=", profile.id);
            if(result.length === 0) {
                const googleEmail = await trx("oauth")
                    .insert({
                        profile_id: profile.id,
                        email: profile._json.email
                    })
                    .returning("email");
                
                await trx("users").insert({
                    name: profile._json.name,
                    email: googleEmail[0].email,
                    joined: new Date()
                })
            };
        })
    } catch (err) {
        console.error(err)
    };
    done(null, profile);
};


passport.use(new googleStrategy({
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    verifiyCallback
));  

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})

app.use(passport.initialize());
app.use(passport.session());




function checkLoggedIn(req, res, next) {
    
    const isLoggedIn = req.isAuthenticated() && req.user;
    if(!isLoggedIn) {
        return res.status(204).send();  //No need to send information
    }
    next();
};


app.get('/', (req, res) => {
    res.send("IT'S WORKING!")
})

app.get("/auth/google", 
    passport.authenticate("google", { scope: ["email", "profile"]}));

app.get("/auth/google/callback", 
    passport.authenticate("google", {
        failureRedirect: "/failure",
    }),
    (req, res) => {
        res.redirect("http://localhost:3000");
    }
);

app.get('/auth/login', checkLoggedIn, (req, res) => {
    res.status(200).json(req.user);
});



app.get("/auth/logout", (req, res, next) => {
    //Remove req.user and clears any logged in session
    req.logout(function (err) {   
        if(err) {
            return next(err);
        }
        res.status(204).send();
    }); 
});


app.post('/signin', (req, res) => {
    handleSignin(req, res, database, bcrypt)
});

app.post('/register', (req, res) => {
    handleRegister(req, res, database, bcrypt, saltRounds)
});        
            
app.post('/auth/profile', (req, res) => {
    handleGoogleProfile(req, res, database)
});

app.post('/imageurl', (req, res) => {
    handleApiCall(req, res)
});

app.put('/image', (req, res) => {
    handleImage(req, res, database)
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
});