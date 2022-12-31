const database = require("../database/postgres");


function checkLoggedIn(req, res, next) {
    const isLoggedIn = req.isAuthenticated() && req.user
    if(!isLoggedIn) {
        return res.status(204).send();  //No need to send information
    }
    next();
};


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


module.exports = {
    checkLoggedIn,
    verifiyCallback
};