const express = require ("express");

const app = express();

const port = 3000

const bodyParser = require ('body-parser')

const Redis = require ('Redis');

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"});

const {v4: uuidv4} = require('uuid');

app.use(bodyParser.json()); //This actually uses body parser class

app.get("/",(req, res) => {
    res.send("Hello Adam");
});

app.post('/login', (req,res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password;
    console.log('Login username: '+ loginUser);
    if (loginUser=="yourmom@gmail.com" && loginPassword=="Yourmom4$0"){
        const loginToken = uuidv4();
        res.send(loginToken);
        res.send("Hello")
    } else {
        res.status(401);
        res.send('Inncorrect password for '+ loginUser);
    }
});

app.listen(port, () => {
    redisClient.connect();
    console.log("listening");
});

