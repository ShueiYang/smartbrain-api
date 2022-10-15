const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const database = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
          }
    }
});


const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, resp) => {
    resp.send("IT'S WORKING!")
})

app.post('/signin', (req, res) =>
{signin.handleSignin(req, res, database, bcrypt)})

app.post('/register', (req, res) => 
{register.handleRegister(req, res, database, bcrypt, saltRounds)})        
            
app.get('/profile/:id', (req, res) => 
{profile.handleProfileGet(req, res, database)})

app.put('/image', (req, res) => 
{image.handleImage(req, res, database)})

app.post('/imageurl', (req, res) => 
{image.handleApiCall(req, res)})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080
}

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})

