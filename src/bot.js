require('dotenv').config();
const keepAlive = require('./server');

// client class allows us to interract with discord API
// to use it, we create an instance on that class 
const { Client, MessageEmbed } = require('discord.js');

const bot = new Client();
const PREFIX = "$";

// EVENTS
bot.on('ready', () => {
    console.log(`${bot.user.tag} has logged in!`);
});

bot.on('guildMemberAdd', (member) => {
    welcomeNewMember(member);
});

// by default this doesn't ignore the  bot message
bot.on('message', (message) => {
    if (message.author.bot) return; 

    sendMessage(message);

    if (message.content.startsWith(PREFIX)) handleMessageCommands(message);
});


const welcomeNewMember = (newMember) => {
    const welcomeChannel = newMember.guild.channels.cache.find(channel => channel.name === 'general');

    const embed = new MessageEmbed()
        .setTitle(`WELCOME TO THE SERVER, ${newMember.user.tag}`)
        .setColor('#E74C3C')
        .setDescription('Please feel free to vibe with anyone, drop suggestions, and add friends')
        .setImage('https://i.giphy.com/media/yyVph7ANKftIs/giphy.mp4')
        .setFooter(`Server: ${newMember.guild.name}`)
    
    welcomeChannel.send(embed);
};

// EVENT HANDLERS
const handleMessageCommands = (message) => {
    console.log('handle');
    const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

    console.log('command name ', CMD_NAME)

    if (CMD_NAME === 'kick') kickUser(message, args);
    if (CMD_NAME === 'ban') banUser(message, args);
};

const sendMessage = (message) => {
    let currentUser = message.author.tag;
    if (message.content === "hello") {
        message.reply(`hello there! ${currentUser}`);
    };
};

const kickUser = (message, args) => {
    console.log('used');
    if (!message.member.hasPermission('KICK_MEMBERS')) {
        return message.channel.send('You do not have permissions to use that command');
    };

    if (args.length === 0) return message.reply('Please provide an id');

    const member = message.guild.members.cache.get(args[0]);
    if (member) {
        member.kick()
            .then((member) => {
                message.channel.send(`${member} was kicked, Sad, to see ${member} leave`);
            })
            .catch((err) => message.channel.send('I do not have kick permissions'));
    } else {
        message.channel.send(`Can't kick user with id ${args[0]}, user not found on this server`);
    };
};

// user's not in the guild/server can be banned from being a member
const banUser = async (message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
        return message.reply('You do not have permissons to use that command')
    };

    if (args.length === 0) return message.reply('Please provide an id');

    try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send(`${user.tag} was banned successfully`)
    } catch (error) {
        console.log(error);
        message.channel.send('An error occured, either I do not have this permission or user was not found');
    }
};


keepAlive();
bot.login(process.env.DISCORDJS_BOT_TOKEN);