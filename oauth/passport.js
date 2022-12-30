const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

const { verifiyCallback } = require("./auth.services");

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
};

passport.use(new googleStrategy({
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: "/v1/auth/google/callback",
        proxy: true
    },
    verifiyCallback
));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})