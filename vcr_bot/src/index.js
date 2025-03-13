require('dotenv').config();
const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, Events   } = require ('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.on('ready', (c) =>{
   console.log(`${c.user.tag} is online`);
});

/*
client.on('messageCreate', async (message) =>{
    if(message.author.bot) return;
    if(message.content !== 'ping') return;

    const firstButton = new ButtonBuilder()
        .setLabel('First button')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('first-button');

    const secondButton = new ButtonBuilder()
        .setLabel('Second button')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('second-button');

    const buttonRow = new ActionRowBuilder().addComponents(firstButton, secondButton);

    const reply = await message.reply({content:'Choose a button.', components: [buttonRow]});

    const filter = (i) => i.user.id === message.author.id;

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
    });

    collector.on('collect', (interaction)=>{
        if(interaction.customId === 'first-button'){
            interaction.reply('First');
            return;
        }

        if(interaction.customId === 'second-button'){
            interaction.reply('second');
            return;
        }
    });
});

 */


client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

    const plusButton = new ButtonBuilder()
        .setLabel('+1')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('plus-button');

    const minusButton = new ButtonBuilder()
        .setLabel('-1')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('minus-button');

    const buttonRow = new ActionRowBuilder().addComponents(plusButton, minusButton);


    //const filter = (i) => i.user.id === message.author.id;

    const BUTTON_MESSAGE = {content:'Set voice room limit.', components: [buttonRow]};


    if(newState.channelId === null) {
        //user left
        if(oldState.channelId !== null) {
            if (oldState.channel.members.size === 0) {

                try{
                    let fetchedMessages = await oldState.channel.messages.fetch({ limit: 100 });

                    let botMessages = fetchedMessages.filter(msg => msg.author.bot);

                    for (const msg of botMessages.values()) {
                        await msg.delete().catch(err => console.error(err));
                    }
                }catch (err) {
                    console.error(`Error in channel ${oldState.channel.name}:`, err);
                }

            }

        }


    } else if(oldState.channelId === null) {
        //user joined
        const channel = client.channels.cache.get(newState.channelId);
        const menuMessage = await channel.send(BUTTON_MESSAGE);

        const collector = menuMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            //filter,
        });

        collector.on('collect', (interaction)=>{
            interaction.deferUpdate();
            if(interaction.customId === 'plus-button'){
                channel.setUserLimit(channel.userLimit + 1);
                return;
            }

            if(interaction.customId === 'minus-button'){
                channel.setUserLimit(channel.userLimit - 1);
                return;
            }
        });


    } else {
        //user moved

    }

});


client.login(process.env.TOKEN);