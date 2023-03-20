const express = require ("express");

const app = express();

const port = 443;

const bodyParser = require ('body-parser')

const Redis = require ('redis');

const redisClient = Redis.createClient({url:'redis://default:N2vdWGsGX5PTTgS3@redis-stedi-adam:6379'});

const {v4: uuidv4} = require('uuid');

const cookieParser = require("cookie-parser");

const https = require('https');

const fs = require('fs');

app.use(bodyParser.json());

app.use(express.static('public'))

app.use(cookieParser());

app.use(async function (req, res, next){
    var cookie = req.cookies.stedicookie;
    if(cookie === undefined && !req.url.includes('login') && !req.url.includes('html')
    && req.url !== '/' && !req.url.includes('css') && !req.url.includes('js') && !req.url.includes('ico') && !req.url.includes('png')) {
        res.status(401);
        res.send('no cookie');
    }
    else{
        res.status(200);
        next();
    }
});

app.post('/rapidsteptest', async (req, res)=>{
    const steps = req.body;
    await redisClient.zAdd('Steps',[{score:0,value:JSON.stringify(steps)}]);
    console.log('Steps', steps);
    res.send('saved');
});

app.get("/",(req, res) => {
    res.send("Hello Adam");
});

app.get("/validate", async(req, res) => {
    const loginToken = req.cookies.stedicookie;
    console.log("loginToken", loginToken)
    const loginUser = await redisClient.hGet('TokenMap', loginToken);
    res.send(loginUser);
}); //Adding the Validate url

app.post('/login', async(req,res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password;
    console.log('Login username: '+ loginUser);
    const correctPassword = await redisClient.hGet('UserMap', loginUser);
    if (loginPassword==correctPassword){
        const loginToken = uuidv4();
        await redisClient.hSet('TokenMap',loginToken,loginUser); // add token to Map
        res.cookie('stedicookie',loginToken);
        res.send(loginToken);
    } else {
        res.status(401);
        res.send('Inncorrect password for '+ loginUser);
    }
});

//app.listen(port, () => {
//    redisClient.connect();
//    console.log("listening");
//});

https.createServer(
    {key: fs.readFileSync('/etc/letsencrypt/live/adamowsley.cit270.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/adamowsley.cit270.com/cert.pem'),
    ca:fs.readFileSync('/etc/letsencrypt/live/adamowsley.cit270.com/fullchain.pem')
    },
    app
    ).listen(port, ()=>{
        redisClient.connect();
        console.log('Listening on port: '+ port);
    })
