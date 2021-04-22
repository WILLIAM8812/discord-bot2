
const Discord = require('discord.js');
const path = require('path');
const imageSearch = require('image-search-google');
const randomWords = require('random-words');
const ytdl = require('discord-ytdl-core');
const { createWriteStream } = require ("fs");

var config = require('./config.json');


//const config = require("./config.json")
/// The list of npm needed :

/// npm i discord.js/@opus
/// npm i sodium 
/// npm i ffmpeg-static
/// npm i discord-ytdl-core
/// npm i canvas
/// npm i request
/// npm i fs
/// 
/// other i forgot

///A faire :
//Bass
//System de commande 2.0
//fichier config
//plein de truc

//let voice = false

'use strict';
let https = require('https');

let cooldown = new Set();


prefixlol = "p"
const bot_token = config.bot_token
const bot_id = config.bot_id
const bot_key = config.bot_key
const cse_id = config.cse_id
const google_api_key = config.google_api_key

const client = new Discord.Client();
  
const activities_list = [
  `Radio !`, 
  `Image Searcher !`,  
  `Works with google api !`
  ];

client.on("ready", () => {
  client.user.setActivity("Démarrage...")
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    client.user.setActivity(`${prefixlol}help | `+activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.'
}, 5000);
})


client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
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
	
	if(command === "help") {
		const embed = new Discord.MessageEmbed()
		.setAuthor("Liste d'aide", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Information.svg/2000px-Information.svg.png")
		.setColor("#FFD800")
		.setDescription(`__**help**__ : Affiche la liste d'aide \n \n __**play**__ : Joue une musique d'une adresse youtube ! \n __/play (url)__ \n \n **__stop__** : Kick le bot d'un channel audio \n __(Il faut etre dans le meme channel)__ \n \n __**setprefix**__ : Change le prefixe \n __(Maxime deux charachétere long.)__\n \n __**ping**__ : Affiche le delais en ms \n \n __**say**__ : Fait dire un message specifique au bot \n \n __**purge**__ : Permet de supprimer les messages (jusqu'a 100) \n \n __**code**__ : Permet de consultée le code open source du bot ! \n \n __**ano**__ : Permet d'envoyer un message anonyme a quelqu'un \n __(/ano [Titre sans espace] [Texte])__ \n \n __**advert**__ : Permet d'envoyer une publicité \n __(/advert [Texte])__ \n \n **__vote__** : Permet de créer un vote \n __(/vote [Titre sans espace] [Texte])__ \n \n **__image__** : Permet de rechercher une image \n __(/image [Texte])__ \n \n **__randomi__** : Permet de rechercher une image aléatoire.\n \n **Le préfixe est actuellement** /`)
		.setTimestamp()
		message.channel.send({embed});

	}

	if(command === "play ") {
		message.delete().catch(O_o=>{}); 
		const voiceChannel = message.member.voice.channel;
	  
		const playid = args.join(" ");
	  
		if (!playid) {
		  return errore("Merci d'indiquer une url !", message);
		}
	  
		if (!voiceChannel) {
		  return errore("Veulliez rejoindre un channel !", message);
		}
	  
	  
		let stream = ytdl(playid, {
		  filter: "audioonly",
		  opusEncoded: true,
	  });
		  message.member.voice.channel.join()
	  .then(connection => {
		//voice = true
		  let dispatcher = connection.play(stream, {
			  type: "opus"
		  })
		  .on("finish", () => {
			message.guild.me.voice.channel.leave();
			//voice = false
		  })
	  });
	  
		  const embed = new Discord.MessageEmbed()
		  .setTitle("Radio")
		  .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		  .setColor("#FFD800")
		  .setDescription(`En train de jouer ${playid}`)
		  .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		  .setTimestamp()
		  message.channel.send({embed})

	
	}





	if(command === "image") {
		if(cooldown.has(message.author.id)) {
		  return errore("Tu dois attendre 10s entre chaque recherche d'image !", message);
	  } else {
		  cooldown.add(message.author.id)
		  setTimeout(() => {cooldown.delete(message.author.id)}, 10000);
	  }
	  let Timer = '10s'
		const terme = args.join(" ");
	  
		google_image(terme, "Image Recherché", 0, message);
	  
	  }
	  
	  
	  if(command === "randomi") {
		if(cooldown.has(message.author.id)) {
		  return errore("Tu dois attendre 10s entre chaque recherche d'image !", message);
	  } else {
		  cooldown.add(message.author.id)
		  setTimeout(() => {cooldown.delete(message.author.id)}, 10000);
	  }
	  let Timer = '10s'
	  
		let term = randomWords();
	  
		google_image(term, term, 0, message);
	  
	  }
	  
	  if(command === "setprefix") {
		const prefix2 = args.join(" ");
	  
		if (!message.author.id === "446010613785821196")
		return errore("Bien essayer", message)
	  
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
	  
	  if(command === "profilepp") {
		const pp = args.join(" ");
	  
		if(pp === '') {
		  const embed = new Discord.MessageEmbed()
		  .setAuthor("Votre photo de profile")
		  .setColor('#FFD800')
		  .setImage(message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048}))
		  .setTimestamp()
		  .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		  message.channel.send({embed});
		} else if(message.mentions.members.first()) {
		  const embed = new Discord.MessageEmbed()
		  .setAuthor(`La photo de profile de ${message.mentions.users.first().username}`)
		  .setColor('#FFD800')
		  .setImage(message.mentions.users.first().displayAvatarURL({ dynamic: true, format: 'png', size: 2048}))
		  .setTimestamp()
		  .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		  message.channel.send({embed});
		} else {
		  errore("Merci d'indiquer un utilisateur valide !", message);
		}
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
	  
	  
	  
	  
	  
	  
	  
	  if(command === "bass") { 
		//if (voice === true) {
		//return errore(`Je suis deja en vocale ! - Fait ${prefixlol}stop si je suis beuger.`, message);
		//}
	  
		
	  message.delete().catch(O_o=>{}); 
	  const voiceChannel = message.member.voice.channel;
	  
	  //TBA
	  //if (voice === true && voiceChannel != client.voice.channel) {
	  //  return errore(`Je suis deja en vocale ! - Fait ${prefixlol}stop si je suis beuger.`, message);
	  //  }
	  //
	  
	  const playid = args.join(" ");
	  
		  if (!message.member.voice.channel) return errore("Tu n'est pas dans un channel vocale.", message);
		  let stream = ytdl(playid, {
			  filter: "audioonly",
			  opusEncoded: true,
			  encoderArgs: ['-af', 'bass=g=35']
		  });
		  
		  message.member.voice.channel.join()
		  .then(connection => {
			//voice = true
			  let dispatcher = connection.play(stream, {
				  type: "opus"
			  })
			  .on("finish", () => {
				message.guild.me.voice.channel.leave();
				//voice = false
			  })
		  });
	  }
	  
	  if(command === "stop") {
	  const voiceChannel = message.member.voice.channel;
	  
	  if (!voiceChannel) {
		return errore("Veuillez allez dans le meme channel que moi pour me kick !", message);
	  }
	  
	  voiceChannel.leave();
	  voice = false
	  errore("Je suis bien parti du channel !", message)
	  
	  
	  }
	  
	  if(command === "joined") {
	  if (!message.author.id === "446010613785821196") {
		return errore("T'essaye de faire quoi la ?", message);
	  } else {
		client.emit('guildMemberAdd', message.member);
	  }
	  }
	  
	  if(command === "stopnow") {
	  if (!message.author.id === "446010613785821196") {
		return errore("T'essaye de faire quoi la ?", message);
	  } else {
		errore("Le bot va s'arretter dans 3 sec !", message);
		setTimeout(() => {process.exit(0);}, 3000);
	  }
	  }
	  
	  
	  
	  
  
  
  
  
  })

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
client.login(bot_token);


function google_image(res, titre, nbr, message) {
const google = new imageSearch(cse_id, google_api_key);
const options = {page:1};
google.search(res, options)
  .then(images => {
    const exampleEmbed = new Discord.MessageEmbed()
    const embed = new Discord.MessageEmbed()
    .setAuthor(titre)
    .setTitle(images[nbr].snippet)
    .setColor("#ff0000")
    .setURL(images[nbr].context)
    .setImage(images[nbr].url)
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
    message.channel.send({embed});
  
    

  })
  .catch(error => console.log(error))
}


function errore(description, message) {
  const embed = new Discord.MessageEmbed()
  .setAuthor("Avertissement")
  .setColor("#ff0000")
  .setDescription(description)
  .setTimestamp()
  .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
  message.channel.send({embed});
}





