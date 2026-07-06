require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");

require("./database");

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({

    intents: [
        GatewayIntentBits.Guilds
    ]

});

client.commands = new Collection();

commandHandler(client);

eventHandler(client);

client.login(process.env.TOKEN);