const bcrypt = require('bcrypt');
const saltRounds = 10;
const { database } = require('../database/postgres');


const handleRegister = async (req, res) => {
    const { name, email, password, checkpassword } = req.body

    if(!name||!email||!password||!checkpassword) {
        return res.status(400).json('Incorrect form submission')
    } else if (password !== checkpassword) {
        return res.status(400).json('Password not match')
    }
    try{
        const hash = await bcrypt.hash(password, saltRounds)

        await database.transaction( async trx => {
                    
            const loginEmail = await trx.insert({
                hash: hash,
                email: email
            })
                .into("login")
                .returning("email")
                .catch((err)=> {throw new Error("Email already being used")});  
            
            const user = await trx.insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
                })
                .into("users")
                .returning("*");
            
            return res.json(user[0]);
        });
    } catch (err) {
        res.status(409).json(`${err}`);
    }
};

module.exports = {
    handleRegister
};