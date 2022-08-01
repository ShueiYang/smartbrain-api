
const handleSignin = (req, resp, database, bcrypt) => {
    const { email, password } = req.body
    
    if(!email||!password) {
        return resp.status(400).json('Wrong username or password')
    }
    
    database.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data=>  {       
                    
            bcrypt.compare( password, data[0].hash, function(err, result) {
                if (result) {
                    return database.select('*').from ('users')
                            .where('email', '=', email)
                            .then(user => resp.json(user[0]))
                            .catch(err => resp.status(400).json('unable to get user'))
                } else {
                    resp.status(400).json('Wrong username or password')
                }
            });   
        })  
        .catch(err => resp.status(400).json('Wrong username or password'))
};

module.exports = {
    handleSignin: handleSignin
}