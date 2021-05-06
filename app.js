const express = require("express");
require("dotenv").config();
const axios = require("axios");
const datetime = require("node-datetime");

const app = express();
const token = process.env.TOKEN;
const port = process.env.PORT;
const tel = `https://api.telegram.org/bot${token}/sendMessage`;

let setuUrl;
let pincode;
let dataSlot_vaccine;
let replyInfo_vaccine;
let responseData_vaccine;

let re = new RegExp("[0-9]+");
let dt = datetime.create();
dt.offsetInDays(-1);
let formatted = dt.format("d-m-Y");

const test =
	"https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=587102&date=$05-05-2021";
const awareness =
	"Coronavirus disease (COVID-19) is an infectious disease caused by a newly discovered coronavirus.\nMost people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment.";
const symptoms = "Aches and pains, sore throat, diarrhoea, coughing, etc.";

let setu = (pincode) => {
	return `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${formatted}`;
};

getInfo = (url, tel, message, res) => {
	axios
		.get(url, {
			headers: {
				"Content-Type": "application/json",
				"Accept-Language": "hi_IN",
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
			},
		})
		.then((response) => {
			responseData_vaccine = response.data.sessions;
			if (responseData_vaccine.length == 0) {
				sendMessage(tel, message, "No sessions as of now.", res);
			} else {
				for (i = 0; i < responseData_vaccine.length; i++) {
					dataSlot_vaccine = responseData_vaccine[i];
					replyInfo_vaccine = `${dataSlot_vaccine.name}\n address: ${dataSlot_vaccine.address},${dataSlot_vaccine.district_name} ${dataSlot_vaccine.state_name}\nVaccine:${dataSlot_vaccine.vaccine}, fee: Rs.${dataSlot_vaccine.fee}\nfrom: ${dataSlot_vaccine.from}, to: ${dataSlot_vaccine.to}`;
					sendMessage(tel, message, replyInfo_vaccine, res);
				}
			}
		})
		.catch((err) => {
			console.log(err);
			sendMessage(tel, message, "Invalid Pincode.", res);
		});
};

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get("/", (req, res) => {
	res.send(
		"Welcome to Covid bot v2.0\n Commands:1) \\aware\n 2)\\symptoms \n 3) \\vaccineinfo"
	);
});

function sendMessage(url, message, reply, res) {
	axios
		.post(url, {
			chat_id: message.chat.id,
			text: reply,
		})
		.then((response) => {
			console.log("Message posted");
			res.end("ok");
		})
		.catch((error) => {
			console.log(error);
		});
}

app.post("/", (req, res) => {
	const { message } = req.body;
	reply =
		"Welcome to Covid bot v2.0\nCommands:\n1) /aware\n2) /symptoms\n3) /vaccineinfo<pincode> \n4/about";
	if (message.text.toLowerCase().indexOf("/start") !== -1)
		sendMessage(tel, message, reply, res);
	else if (message.text.toLowerCase().indexOf("/aware") !== -1)
		sendMessage(tel, message, awareness, res);
	else if (message.text.toLowerCase().indexOf("/symptoms") !== -1)
		sendMessage(tel, message, symptoms, res);
	else if (message.text.toLowerCase().indexOf("/about") !== -1)
		sendMessage(tel, message, symptoms, res);
	else if (message.text.toLowerCase().indexOf("/vaccinesinfo") !== -1) {
		pincode = re.exec(message.text.toLowerCase())[0];
		console.log(pincode);
		if (pincode == null) sendMessage(tel, message, "Invalid Pincode.", res);
		else if (pincode.length != 6)
			sendMessage(tel, message, "Invalid Pincode.", res);
		else {
			setuUrl = setu(pincode);
			console.log(setuUrl);
			try {
				getInfo(setuUrl, tel, message, res);
			} catch (err) {
				console.log(err);
			}
		}
	} else sendMessage(tel, message, "Invalid Command", res);
});

app.listen(port || 3000, () =>
	console.log(`Telegram bot is listening on port ${port || 3000}!`)
);
