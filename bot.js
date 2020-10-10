
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const Canvas = require('canvas');
const config = require("./config.json");

prefixlol = "p"
let token = config.token;

const client = new Discord.Client();

const activities_list = [
  `${prefixlol}help | Radio !`, 
  `${prefixlol}help | Recorder !`,  
  ];

client.on("ready", () => {
  client.user.setActivity("Démarrage...")
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
}, 10000);
  
})

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === '📯important📯');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '32px sans-serif';
	ctx.fillStyle = '#ff0000';
	ctx.fillText('Bienvenue sur Cookies Rp !', canvas.width / 2.8, canvas.height / 3.5);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Bienvenue sur Cookies Rp, ${member}!`, attachment);
});

client.on('guildMemberRemove', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === '📯important📯');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '32px sans-serif';
	ctx.fillStyle = '#ff0000';
	ctx.fillText('A plus tard sur Cookies Rp !', canvas.width / 2.8, canvas.height / 3.5);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`A plus tard sur Cookies Rp, ${member}!`, attachment);
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
  
  // It's good practice to ignore other bots. This also makes your bot ignore itclient
  // and not get into a spam loop (we call that "botception").
 
  
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
    const embed = new Discord.MessageEmbed()
    .setAuthor("Pong !")
    .setColor("#FFD800")
    .setDescription(`Pong! La latence du bot est de ${Math.round(client.ws.ping)}ms.`)
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    message.channel.send({embed});
  }


  if(command === "help") {
    // Help for the bots
    const embed = new Discord.MessageEmbed()
    .setAuthor("Liste d'aide", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Information.svg/2000px-Information.svg.png")
    .setColor("#FFD800")
    .setDescription(`__**help**__ : Affiche la liste d'aide \n \n __**play**__ : Joue une musique d'une adresse youtube ! \n __${prefixlol}play (url)__ \n \n **__stop__** : Kick le bot d'un channel audio \n __(Il faut etre dans le meme channel)__ \n \n __**setprefix**__ : Change le prefixe \n __(Maxime deux charachétere long.)__\n \n __**ping**__ : Affiche le delais en ms \n \n __**say**__ : Fait dire un message specifique au bot \n \n __**purge**__ : Permet de supprimer les messages (jusqu'a 100) \n \n __**code**__ : Permet de consultée le code open source du bot ! \n \n __**ano**__ : Permet d'envoyer un message anonyme a quelqu'un \n __(${prefixlol}ano [Titre sans espace] [Texte])__ \n \n __**advert**__ : Permet d'envoyer une publicité \n __(${prefixlol}advert [Texte])__ \n \n **__vote__** : Permet de créer un vote \n __(${prefixlol}vote [Titre sans espace] [Texte])__ \n \n **Le préfixe est actuellemnt** ${prefixlol}`)
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    message.channel.send({embed});
  }

  if(command === "setprefix") {
    const prefix2 = args.join(" ");

    if(!prefix2 || prefix2.length > 2)
    return errore("Merci d'écrire un prefixe valide", message);

    prefixlol = prefix2
    errore("Le préfixe a bien été changer !", message)

  }

  if(command === "code") {
    // Show inside the body
    const embed = new Discord.MessageEmbed()
    .setAuthor("Code")
    .setColor("#FFD800")
    .setDescription(`**Voici le code open source :**`)
    .addFields(
      { name: 'Le github :', value: 'https://github.com/WILLIAM8812/discord-bot2/blob/master/bot.js' },
    )
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    message.channel.send({embed});
  }
  
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itclient we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");

    if(!sayMessage)
      return errore("Merci d'écrire un message valide", message);
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  

  
  if(command === "purge") {
    if(!message.member.permissions.has('MANAGE_MESSAGES'))  
      return errore("Tu dois avoir la permissions **MANAGE_MESSAGES** pour faire ca !", message);

    let member = message.mentions.members.first();
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return errore("Merci de donner un nombre entre 2 et 100", message);
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.messages.fetch({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => errore(`Impossible de supprimer les messages car : ${error}`, message));
      const embed = new Discord.MessageEmbed()
      .setAuthor("Avertissement")
      .setColor("#FFD800")
      .setDescription(`**${deleteCount} messages ont** été suprimés.`)
      .setTimestamp()
      .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
      message.channel.send({embed})
      .then(function(message) {
        setTimeout(() => { message.delete(); }, 3000);
      }).catch(function() {
      });

  
      
  }

 if(command === "ano") {

  const emebed_text = args.slice(1).join(' ');
  const emebed_title = args[0];

  message.delete().catch(O_o=>{}); 
  
  if(!emebed_text)
  return errore("Merci d'écrire un message valide", message);

  if(!emebed_title)
  return errore("Merci d'écrire un titre valide", message);


  const embed = new Discord.MessageEmbed()
  .setTitle(emebed_title)
  .setAuthor("Message Anonyme", " https://wir.skyrock.net/wir/v1/profilcrop/?c=mog&w=301&h=301&im=%2Fart%2FPRIP.92288752.5.2.jpg")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor([255, 0, 0])
  .setDescription(emebed_text)
  .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
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
  return errore("Merci d'écrire un message valide", message);

  const embed = new Discord.MessageEmbed()
  .setTitle("Publicité")
  .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
  .setColor("#FFD800")
  .setDescription(advert_text)
  .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
  .setTimestamp()
  message.channel.send({embed});
}


if(command === "vote") {

  message.delete().catch(O_o=>{}); 

  const election_texte = args.slice(1).join(' ');
  const election_titre = args[0];

  if(!election_texte)
    return errore("Erreur, veullez mettre un titre et du texte", message);


    const embed = new Discord.MessageEmbed()
    .setTitle(election_titre)
    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    .setColor("#FFD800")
    .setDescription(election_texte)
    .setFooter("Répondre avec ✅ ou ❌", client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    .setTimestamp()
    message.channel.send({embed})
      .then(function(message) {
        message.react("✅")
        message.react("❌")
      }).catch(function() {
      });
}

if(command === "play") { 
  message.delete().catch(O_o=>{}); 
  const voiceChannel = message.member.voice.channel;

  const playid = args.join(" ");

  if (!playid) {
    return errore("Merci d'indiquer une url !", message);
  }

  if (!voiceChannel) {
    return errore("Veulliez rejoindre un channel !", message);
  }


  voiceChannel.join().then(connection => {
    const stream = ytdl(playid, { filter: 'audioonly' });
    const dispatcher = connection.play(stream);

    const embed = new Discord.MessageEmbed()
    .setTitle("Radio")
    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    .setColor("#FFD800")
    .setDescription(`En train de jouer ${playid}`)
    .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    .setTimestamp()
    message.channel.send({embed})


    dispatcher.on('finish', () => voiceChannel.leave());
  });
}

if(command === "stop") {
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return errore("Veuillez allez dans le meme channel que moi pour me kick !", message);
  }

  voiceChannel.leave();
  errore("Je suis bien parti du channel !", message)


}



})
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
client.login(token);

function errore(description, message) {
  const embed = new Discord.MessageEmbed()
  .setAuthor("Avertissement")
  .setColor("#ff0000")
  .setDescription(description)
  .setTimestamp()
  .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
  message.channel.send({embed});
}

