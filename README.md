# CoviBot

## About 
CoviBot is an intelligent telegram based chatbot. The bot helps the users with covid-19 information and find vaccination slots based on their location through CoWin API ( Aarogya Setu Govt API ). 

<div align="center">
<img src="https://drive.google.com/uc?export=view&id=1dhPzPTJPGYrLuo-3Kn7BxCMHOy-8qdLo" >
</div>


## Invite Bot

CoviBot can be invited to your telegram account from our website [covibot.life](https://covibot.life)

Step 1: Open the website by clicking [here](https://covibot.life)

Step 2: Navigate to "Get CoviBot"

Step 3: Tap on the "Invite CoviBot to Telegram" button & follow the instructions.


<div align="center">
<img src="https://drive.google.com/uc?export=view&id=1YAh3crgBdT4LG_WTcyov5RUZ9w-HVTSJ" >
</div>

## Website
 Go to [covibot.life](https://covibot.life) in order to find everything you need about the Covibot.


## CoWin API
[CoWin API](https://github.com/cowinapi/developer.cowin) is a public api hosted by CoWin to get vaccine information in different parts of India.


## Dialogflow
![flowchar.png](https://lh3.googleusercontent.com/f0bamKZBdTkGXLH4vbFSfPpAevqg1NPglW7g1JIuWaqoDjX5PysrXtoCs8i2uQGg1KPnjyVn2p-pibDNra311qDzPhgZuZRUIuUCG15SjQZjRfC3UgPMMysm-QFGlTP5PfFkGq2qCrE)

We have used dialogflow as our NLP agent to process the user queries from the telegram bot and produce intents from those queries so that we can reply with the relevent information to the user back.

For instance, vaccine information queries from the user will be processed and matched with "vaccine" intent which is pre-defined by us and dialgoflow will call a post request to our server hosted in azure using webhook feature, our server using the pincode in the query calls the CoWin api to get the vaccine information in that region and sends it back to the dialogflow as fulfillment and finally dialogflow will send that information back to the user.

## Dependencies
Following are the libraries we have used:
- dialogflow-fulfillment for interaction with the dialogflow agent.
- express for server creation.
- axios for https requests.

## Deployment
We have deployed our server on Microsoft Azure([here](https://covibot09.azurewebsites.net/)).

Local servers can be deployed and redirected to a temporary domain using ngrok and further webhooked to the telegram bot for development purposes.
