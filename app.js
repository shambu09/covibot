const express = require("express");
const app = express();
const axios = require("axios");
const dfff = require("dialogflow-fulfillment");
const datetime = require("node-datetime");

let pincode;
const port = process.env.PORT;
let responseData_vaccine;
let data;
let dataSlot_vaccine;

let dt = datetime.create();
let formatted = dt.format("d-m-Y");

let setu = (pincode) => {
	return `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${formatted}`;
};

getInfo = (url, res) => {
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
				data = "No sessions as of now.";
			} else {
				data = "" + formatted + ":\n\n";
				for (i = 0; i < responseData_vaccine.length; i++) {
					dataSlot_vaccine = responseData_vaccine[i];
					data += `${i + 1})  ${dataSlot_vaccine.name}\naddress: ${
						dataSlot_vaccine.address
					},${dataSlot_vaccine.district_name} ${
						dataSlot_vaccine.state_name
					}\nVaccine:${dataSlot_vaccine.vaccine}, fee: Rs.${
						dataSlot_vaccine.fee
					}\nfrom: ${dataSlot_vaccine.from}, to: ${
						dataSlot_vaccine.to
					}\n\n`;
				}
			}
			res.json({
				fulfillmentText: data,
			});
		})
		.catch((err) => {
			console.log(err);
			data = "Invalid Pincode.";
			res.json({
				fulfillmentText: data,
			});
		});
};

app.get("/", (req, res) => {
	res.send("live covibot");
});

app.post("/", express.json(), (req, res) => {
	const agent = new dfff.WebhookClient({
		request: req,
		response: res,
	});
	pincode = req.body.queryResult.parameters.number;
	console.log(pincode);
	setuUrl = setu(pincode);
	console.log(setuUrl);
	getInfo(setuUrl, res);
});

app.listen(port||3000, () => console.log("Server is live at port " + port||3000));
