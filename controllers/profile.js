
const handleProfileGet = (req, res, database) => {
    const { id } = req.params;

    database.select('*').from('users')
            .where({ id })
            .then(user => {
                if (user.length) {
                    res.json(user[0])
                } else {
                    res.status(404).json('Not Found')
                }
            })
            .catch(err => res.status(400).json(`${err}`))
}

module.exports = {
    handleProfileGet
}