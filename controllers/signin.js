const bcrypt = require('bcrypt');
const { database } = require('../database/postgres');


const handleSignin = async (req, res) => {
    const { email, password } = req.body
    
    if(!email||!password) {
        return res.status(400).json({message: 'Please provide a username or password'})
    }  
    try {
        const data = await database.select('email', 'hash')
            .from('login')
            .where('email', '=', email);
        
        if(!data.length) {
            return res.status(401).json({message: 'Wrong username or password'});
        }
        const result = await bcrypt.compare(password, data[0].hash);            
                
        if(!result) {
            return res.status(401).json({message: 'Wrong username or password'}); 
        } 
        const user = await database.select('*')
            .from ('users')
            .where('email', '=', email);
        
        return res.json(user[0]); 
    
    } catch (err) {
        res.status(500).json(`${err}`);
    }; 
};

module.exports = {
    handleSignin
};