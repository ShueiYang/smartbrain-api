

const handleRegister = (req, resp, database, bcrypt, saltRounds) => {
    const { name, email, password, checkpassword } = req.body

    if(!name||!email||!password||!checkpassword) {
        return resp.status(400).json('Incorrect form submission')
    }else if (password !== checkpassword) {
        return resp.status(400).json('Password not match')
    }
    
    bcrypt.hash(password, saltRounds, function (err, hash) {

        database.transaction(trx => {
                trx.insert({
                    hash: hash,
                    email: email
                })
                    .into('login')
                    .returning('email')
                    
                    .then(loginEmail => 
                        trx('users')
                        .returning('*')
                        .insert({
                            name: name,
                            email: loginEmail[0].email,
                            joined: new Date()
                        })
                        .then(user => {
                            resp.json(user[0])
                        })
                    )
                    .then(trx.commit) 
                    .catch(trx.rollback)  
            })

                .catch (err =>
                    resp.status(400).json('Unable to register or email already being used'));
    });
};
module.exports = {
    handleRegister: handleRegister
};