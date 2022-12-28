require('dotenv').config();
const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const helmet = require("helmet");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

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
app.use(cors());


const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    // COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    // COOKIE_KEY_2: process.env.COOKIE_KEY_2
};

function verifiyCallback(accessToken, refreshToken, profile, done) {
    console.log('Google profile', profile.displayName);
    
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

passport.deserializeUser((id, done) => {
    // User.findbyId(id).then(user => {
    //     done(null, user);
    // })
    done(null, id);
})

app.use(passport.initialize());






app.get('/', (req, res) => {
    res.send("IT'S WORKING!")
})

app.get("/auth/google", 
    passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/callback", 
    passport.authenticate("google", {
        failureRedirect: '/failure',
        successRedirect: "/home",
        session: false
    }),
    (req, res) => {
        console.log("Google called us back !")
    });






app.post('/signin', (req, res) =>
{signin.handleSignin(req, res, database, bcrypt)})

app.post('/register', (req, res) => 
{register.handleRegister(req, res, database, bcrypt, saltRounds)})        
            
app.get('/profile/:id', (req, res) => 
{profile.handleProfileGet(req, res, database)})

app.put('/image', (req, res) => 
{image.handleImage(req, res, database)})

app.post('/imageurl', (req, res) => 
{image.handleApiCall(req, res)})


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
});