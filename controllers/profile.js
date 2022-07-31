
const handleProfileGet = (req, resp, database) => {
    const { id } = req.params;

    database.select('*').from('users')
            .where({ id })
            .then(user => {
                if (user.length) {
                    resp.json(user[0])
                } else {
                    resp.status(400).json('Not Found')
                }
            })
            .catch(err => resp.status(400).json('Error getting user'))
}

module.exports = {
    handleProfileGet
}