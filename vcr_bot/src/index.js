const { Client, GatewayIntentBits  } = require ('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});


client.login("MTIxMDkzMjk3Mjc4NjgxOTEwMw.GOQO7s.LTRFWMTLCzlWcr6JMnNGKnUoIkQpqKbDUVHH9o");