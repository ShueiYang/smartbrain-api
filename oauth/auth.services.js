const { database } = require("../database/postgres");


function checkLoggedIn(req, res, next) {
    const isLoggedIn = req.isAuthenticated();
    if(!isLoggedIn) {
        console.log("User is not authenticated...")
        return res.status(401).json(`You must authenticate to get access, or some error occur 
            and you're unable to log in, you can retry with different browsers or contact the admin.`)  
    }
    console.log("Authenticate successfully!")
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
        return done(null, null);
    };
    done(null, profile);
};


module.exports = {
    checkLoggedIn,
    verifiyCallback
};