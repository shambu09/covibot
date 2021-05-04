const express = require("express");
require('dotenv').config();
const axios = require("axios");

const app = express();
const token = process.env.TOKEN;
const port = process.env.PORT
const tel = `https://api.telegram.org/bot${token}/sendMessage`;


const awareness = "FUCK COVID.";
const symptoms  = "aches and pains, sore throat, diarrhoea, mental retardness";

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.get("/", (req, res)=>{
    res.send("Welcome to Covid bot v2.0\n Commands:1) \\aware\n 2)\\simptons");
});

function sendMessage(url, message, reply, res){
    axios.post(url, {
        'chat_id': message.chat.id,
        'text': reply
        }).then(response => {
            console.log("Message posted");
            res.end("ok");
        }).catch(error =>{
        console.log(error);
    });
 }

app.post("/", (req, res)=>{
    const { message } = req.body;
    reply = "Welcome to Covid bot v2.0\nCommands:\n1) /aware\n2) /simptons";
    if(message.text.toLowerCase().indexOf("/start") !== -1)
        sendMessage(tel,message,reply,res);
    else if(message.text.toLowerCase().indexOf("/aware") !== -1)
        sendMessage(tel,message,awareness,res);
    else if(message.text.toLowerCase().indexOf("/simptons") !== -1)
        sendMessage(tel,message,symptoms,res);
    else
        sendMessage(tel,message,"Invalid Command",res);
});

app.listen(port, () => console.log(`Telegram bot is listening on port ${port}!`));