const express = require ("express");

const app = express();

const port = 3000

const bodyParser = require ('body-parser')

app.use(bodyParser.json()); //This actually uses body parser class

app.get("/",(req, res) => {
    res.send("Hello Adam");
});

app.post('/login', (req,res) =>{
    const loginUser = req.body.userName;
    console.log('Login username: '+ loginUser);
    res.send('Hello '+ loginUser);
});

app.listen(port, () => {
    console.log("listening");
});

