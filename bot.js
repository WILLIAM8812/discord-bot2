// Load up the discord.js library
const Discord = require('discord.js');
const prefixlol = "+"
const agree = "✅";
const disagree = "❌";

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
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
  const args = message.content.slice(prefixlol.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const bsod = client.emojis.find(emoji => emoji.name === "bsod");
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! La latence est de ${m.createdTimestamp - message.createdTimestamp}ms. La latence du bot est de  ${Math.round(client.ping)}ms ${bsod}`);
  }

  if(command === "help") {
    // Help for the bots
    const gmod = client.emojis.find(emoji => emoji.name === "gmod");
    return message.reply(` __**GUIDE D'AIDE**__ ${gmod} \n \n __**help**__ : Affiche la liste d'aide \n \n __**ping**__ : Affiche le delais en ms \n \n __**say**__ : Fait dire un message specifique au bot \n \n __**purge**__ : Permet de supprimer les messages (jusqu'a 100) \n \n __**code**__ : Permet de consultée le code open source du bot ! \n \n __**ano**__ : Permet d'envoyer un message anonyme a quelqu'un \n __(+ano [Titre sans espace] [Texte])__ \n \n __**advert**__ : Permet d'envoyer une publicité \n __(+advert [Texte])__ \n \n **__vote__** : Permet de créer un vote \n __(+vote [Titre sans espace] [Texte]) \n \n **Le préfixe est actuellemnt** ${prefixlol}`);
    
  }

  if(command === "code") {
    // Show inside the body
    return message.reply("Voila le github : __https://github.com/WILLIAM8812/discord-bot2/blob/master/bot.js__");
    
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
  

  
  if(command === "purge") {
    if(!message.member.roles.some(r=>["Fondateur(s) EagleLife"].includes(r.name)) )
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

 if(command === "ano") {

  const emebed_text = args.slice(1).join(' ');
  const emebed_title = args[0];

  message.delete().catch(O_o=>{}); 
  
  if(!emebed_text)
  return message.reply("Merci d'écrire un message valide");

  if(!emebed_title)
  return message.reply("Merci d'écrire un titre valide");


  const embed = new Discord.RichEmbed()
  .setTitle(emebed_title)
  .setAuthor("Message Anonyme", " https://wir.skyrock.net/wir/v1/profilcrop/?c=mog&w=301&h=301&im=%2Fart%2FPRIP.92288752.5.2.jpg")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor([255, 0, 0])
  .setDescription(emebed_text)
  .setFooter(client.user.username, client.user.avatarURL)
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
  /*
   * Blank field, useful to create some space.
   */
 
  message.channel.send({embed});
}

if(command === "advert") {

  const advert_text = args.join(" ");

  message.delete().catch(O_o=>{}); 
  
  if(!advert_text)
  return message.reply("Merci d'écrire un message valide");


  const embed = new Discord.RichEmbed()
  .setTitle("Publicité")
  .setAuthor(message.author.username, message.author.avatarURL)
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor("#FFD800")
  .setDescription(advert_text)
  .setFooter(client.user.username, client.user.avatarURL)
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
  /*
   * Blank field, useful to create some space.
   */
 
  message.channel.send({embed});
}


if(command === "vote") {

  exports.run = async (client, message, args, level) => {
    // On efface la commande.
    message.delete();
  
    // Variables
      let params = args.splice(0).join(" ").split("|");
      let pollTitle = params[0];
      let pollQuestion = params[1];
      let pollTime = params[2] || 0;
      let pollAuthor = message.author.username;
      let pollTimeReaction;
      let pollTimeUnity;
  
      // On vérifie qu'il ne manque aucun paramètre
    if (params.length < 1)
    {
      return message.author.send(`Il manque des paramètres dans cette fonction.`);
      }
  
      // Si le premier paramètre est "aide" ou "help", ça donne une info.
      if (params[0] == "aide" || params[0] == "help")
      {
          return message.author.send(`Utilisation : !sondage <Titre>|<Question du sondage>|<Temps en millisecondes>`);
      }
      
      if (pollTime >= 86400000)
      {
          pollTimeReaction = Math.floor(pollTime / 86400000);
          pollTimeUnity = "jours";
      }
      else if (pollTime >= 3600000)
      {
          pollTimeReaction = Math.floor(pollTime / 3600000);
          pollTimeUnity = "heures";
      }
      else if (pollTime >= 60000)
      {
          pollTimeReaction = Math.floor(pollTime / 60000);
          pollTimeUnity = "minutes";
      }
      else
      {
          pollTimeReaction = Math.floor(pollTime / 1000);
          pollTimeUnity = "secondes";
      }
  
    let pollEmbed = new Discord.RichEmbed()
      .setTitle(`Sondage : ${pollTitle}`)
      .setDescription(pollQuestion)
          .setFooter(`Sondage de ${pollAuthor}. Le sondage prendra fin dans ${pollTimeReaction} ${pollTimeUnity}.`);
  
    let pollMessage = await message.channel.send(pollEmbed);
    
      await pollMessage.react(agree);
      await pollMessage.react(disagree);
    
      // On crée une collection des réactions
    const reactions = await pollMessage.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, { max: 1, time: pollTime });
      const agreeCount = reactions.get(agree).count-1;
      const disagreeCount = reactions.get(disagree).count-1;
  
    let resultsEmbed = new Discord.RichEmbed()
      .setTitle("Résultats du sondage")
      .setDescription(`${pollQuestion}`)
      .addField(agree, `${agreeCount} vote(s)`, true)
      .addField(disagree, `${disagreeCount} vote(s)`, true)
          .setFooter(`Sondage de ${pollAuthor}`);
  
    message.channel.send(resultsEmbed);
    pollMessage.delete(0);
  };

}




});
client.login(process.env.BOT_TOKEN);

