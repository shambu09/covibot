const express = require("express");
require('dotenv').config();
const axios = require("axios");

const app = express();
const token = process.env.TOKEN;
const port = process.env.PORT
const tel = `https://api.telegram.org/bot${token}/sendMessage`;

let re = new RegExp('[0-9]+');
let setuUrl;
let temp;
let s;

var datetime = require('node-datetime');
var dt = datetime.create();
dt.offsetInDays(-1);
var formatted = dt.format('d-m-Y');

let setu = (pincode)=>{
   return `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${formatted}`;
};

const test = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=587102&date=$05-05-2021";
const awareness = "Coronavirus disease (COVID-19) is an infectious disease caused by a newly discovered coronavirus.\nMost people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment."
const symptoms  = "Aches and pains, sore throat, diarrhoea, coughing, etc.";

getInfo = (url,tel,message,res)=>{
    axios.get(url,  {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
        }})
        .then((response)=>{
            temp = response.data.sessions[0];
            s = `${temp.name}\n address: ${temp.address},${temp.district_name} ${temp.state_name}\nVaccine:${temp.vaccine}, fee: Rs.${temp.fee}\nfrom: ${temp.from}, to: ${temp.to}`;
            sendMessage(tel,message,s,res)
        })
        .catch((err)=>{
            console.log(err);
        });
};

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.get("/", (req, res)=>{
    res.send("Welcome to Covid bot v2.0\n Commands:1) \\aware\n 2)\\symptoms \n 3) \\vaccineinfo");
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
    reply = "Welcome to Covid bot v2.0\nCommands:\n1) /aware\n2) /symptoms\n3) /vaccineinfo";
    if(message.text.toLowerCase().indexOf("/start") !== -1)
        sendMessage(tel,message,reply,res);
    else if(message.text.toLowerCase().indexOf("/aware") !== -1)
        sendMessage(tel,message,awareness,res);
    else if(message.text.toLowerCase().indexOf("/symptoms") !== -1)
        sendMessage(tel,message,symptoms,res);
    else if(message.text.toLowerCase().indexOf("/vaccinesinfo") !== -1)
        {
            setuUrl = setu(re.exec(message.text.toLowerCase()));
            console.log(setuUrl);
            getInfo(setuUrl, tel, message, res)
        }
    else
        sendMessage(tel,message,"Invalid Command",res);
    
});

app.listen(port||3000, () => console.log(`Telegram bot is listening on port ${port||3000}!`));