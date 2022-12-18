
const handleSignin = (req, res, database, bcrypt) => {
    const { email, password } = req.body
    
    if(!email||!password) {
        return res.status(400).json('Please provide a username or password')
    }
    
    database.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data=>  {       
                    
            bcrypt.compare( password, data[0].hash, function(err, result) {
                if (result) {
                    return database.select('*').from ('users')
                            .where('email', '=', email)
                            .then(user => res.json(user[0]))
                            .catch(err => res.status(500).json(`Unable to get user: ${err}`))
                } else {
                    res.status(401).json('Wrong username or password')
                }
            });   
        })  
        .catch(err => res.status(400).json('Wrong username or password'))
};

module.exports = {
    handleSignin
};