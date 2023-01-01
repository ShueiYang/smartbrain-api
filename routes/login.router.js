const express = require("express");
const passport = require("passport");
const loginRouter = express.Router();


const { handleGoogleProfile } = require("../controllers/auth.profile");
const { checkLoggedIn } = require("../oauth/auth.services");


loginRouter.get("/google", 
    passport.authenticate("google", { scope: ["email", "profile"]}
));

loginRouter.get("/google/callback", 
    passport.authenticate("google", {
        failureRedirect: "/failure",
    }),
    (req, res) => {
        res.redirect(process.env.FRONTEND_BASE_URL);
    }
);

loginRouter.get("/login", checkLoggedIn, (req, res) => {
    res.status(200).json(req.user);
});

loginRouter.get("/logout", (req, res, next) => {
    //Remove req.user and clears any logged in session
    req.logout(function (err) {   
        if(err) {
            return next(err);
        }
        res.status(204).send();  //No need to send information
    }); 
});

loginRouter.post("/profile", handleGoogleProfile);


module.exports = loginRouter;