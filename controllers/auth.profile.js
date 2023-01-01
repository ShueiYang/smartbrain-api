const { database } = require('../database/postgres');


const handleGoogleProfile = (req, res) => {
    const { email } = req.body

    database.select('*')
            .from('users')
            .where('email', '=', email)
            .then(user => {
                if (user.length) {
                    res.json(user[0])
                } else {
                    res.status(404).json('User Not Found')
                }
            })
            .catch(err => res.status(400).json(`${err}`))
}

module.exports = {
    handleGoogleProfile
}