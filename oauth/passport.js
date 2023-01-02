const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

const { verifiyCallback } = require("./auth.services");
const { database } = require("../database/postgres");

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
    console.log("SERIALIZE:", user.id)
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    try{
        const result = await database.select("profile_id")
            .from("oauth")
            .where("profile_id", "=", user.id);
        if(!result.length) {
            throw new Error("User not found...")
        }
        console.log("DESERIALIZE:", user.id)
        done(null, user);    
    } catch (err) {
        console.log(err)
        done(err, null);
    }
});