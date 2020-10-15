const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const weather = require("weather-js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});


////////////////////////////hoşgeldin mesajı///////////////////  

client.on("guildMemberAdd", (member, message) => {
  if (member.guild.id !== "763104952754765944") return; //SUNUCU İD
  let user = client.users.get(member.id);
  require("moment-duration-format");
  let eskiisim = member.user.username;
  const id = "763115159710990366"; //MESAJIN GİDECEĞİ KANAL İD
  const channel = member.guild.channels.get(id);
  let zaman = new Date().getTime() - user.createdAt.getTime()
  const hesapzaman = moment.duration(zaman).format(` YY [Yıl] DD [Gün] HH [Saat] mm [Dakika] ss [Saniye]`) 
  const hg = new Discord.RichEmbed()
  .setColor('BLACK')
  .setThumbnail(member.user.avatarURL) 
  .setTitle(`Aglaia'ya Hoşgeldiniz`)
  .setDescription(`<a:pembetac:763293311741853746> Sunucumuza Hoşgeldin ${member.toString()} 

<a:onaywhite:763122127397847081> Seninle Beraber ${member.guild.memberCount} Kişiyiz

<a:eriyenkalp:763293061912199200> Kaydının Yapılması için Sesli Odaya Gelip Teyit Vermen Gerekli

<a:danspanda:763293123286663168>  <@&763115080207695892> Rolündeki Yetkililer Seninle İlgilenecektir

<a:sonsuzluk2:763122082628108370> Hesap Açılalı: **${hesapzaman}** Olmuş`)
  .setImage("https://media.giphy.com/media/KkswQk3djNXPTNX9rd/giphy.gif")
  .setFooter('Krios By')  
  channel.send(hg)
});


client.on("guildMemberAdd", async (member, message) => {
 let yetkili = ["<@&763115080207695892>"]; //Yetkili rolünüz ID'sini girin.
  let kanal = client.channels.get("763115159710990366"); //Kanalınızın ID'sini girin.

           kanal.send(`${yetkili}, Kayıt olmayı bekleyen üye var`).then(msg => msg.delete(1000))

})


client.on("message", async message => {
  if (message.content === "!gir") {
   
    client.emit(
      "guildMemberAdd",
      message.member || (await message.guild.fetchMember(message.author))
    );
  }
});



client.login(ayarlar.token);

