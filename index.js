// Load up the discord.js library
const token = process.env.token
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity("Booting...");
  prefixlol = config.prefix;
  client.user.setActivity(prefixlol +"help");
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(motdMessage);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(motdMessage);
});



client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(prefixlol) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! La latence est de ${m.createdTimestamp - message.createdTimestamp}ms. La latence du bot est de  ${Math.round(client.ping)}ms`);
  }

  if(command === "help") {
    // Help for the bots
    return message.reply(" __**GUIDE D'AIDE**__ \n \n __**help**__ : Affiche la liste d'aide \n \n __**ping**__ : Affiche le delais en ms \n \n __**say**__ : Fait dire un message specifique au bot \n \n __**kick**__ : Permet de kick un joueur \n \n __**ban**__ : Permet de ban un joueur \n \n __**purge**__ : Permet de supprimer les messages (jusqu'a 100) \n \n __**mybody**__ : Montre l'interieur de mon corps (codes) \n \n __**setprefix**__ : Definit le prefix \n \n**Le préfixe est actuellemnt** ``" + prefixlol + "``");
    
  }

  if(command === "mybody") {
    // Show inside the body
    return message.reply("Voila, l'interieur de mon coprs : https://imgur.com/a/7U68qVt");
    
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["🚀Fondateur🚀"].includes(r.name)) )
      return message.reply("Desoler, mais tu ne peux pas faire ca !");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Merci de mentionner un utilisatuer valide ");
    if(!member.kickable) 
      return message.reply("Je ne peux pas kick cette utilisateur ! A t-il un role plus important ? Est ce que j'ai la permission de kick ?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Aucucne raison donner";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Desoler ${message.author} Je ne peux pas kick car : ${error}`));
    message.reply(`${member.user.tag} a été kicker ${message.author.tag} car : ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["🚀Fondateur🚀"].includes(r.name)) )
      return message.reply("Desoler, mais tu ne peux pas faire ca !");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Merci de mentionner un utilisatuer valide");
    if(!member.bannable) 
      return message.reply("Je ne peux pas kick cette utilisateur ! A t-il un role plus important ? Est ce que j'ai la permission de kick ?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Aucucne raison donner";
    
    await member.ban(reason)
      .catch(error => message.reply(`Desoler ${message.author} Je ne pas ban car : ${error}`));
    message.reply(`${member.user.tag} a été banni ${message.author.tag} car : ${reason}`);
  }
  
  if(command === "purge") {
    if(!message.member.roles.some(r=>["🚀Fondateur🚀"].includes(r.name)) )
      return message.reply("Desoler, mais tu ne peux pas faire ca !");
    
    let member = message.mentions.members.first();
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Merci de donner un nombre entre 2 et 100");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Impossible de supprimer les messages car : ${error}`));
  }



  if(command === "setprefix") {
    if(!message.member.roles.some(r=>["🚀Fondateur🚀"].includes(r.name)) )
      return message.reply("Desoler, mais tu ne peux pas faire ca !");
    
    let member = message.mentions.members.first();

    const prefixlol2 = args.join(" ");

    if(!prefixlol2 || prefixlol2.length < 0 || prefixlol2.length > 1)
      return message.reply("Merci de mettre une seule lettre !");
    
    prefixlol = prefixlol2;

    
    client.user.setActivity(prefixlol +"help");
      return message.reply('Le prefix a bien été changée en ' + prefixlol);
      
  }



});
client.login(token);

