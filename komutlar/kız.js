const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
 

  if (
    !message.member.roles.has("763115080207695892") &&
    !message.member.hasPermission("ADMINISTRATOR")
  )
    return message.channel.sendEmbed(
      new Discord.RichEmbed()
        .addField(
          ` Bu komutu kullanmak için **kayıt yetkisine** sahip olman gerek!`
        )
        .setColor("black")
        .setFooter(message.author.tag, message.author.avatarURL)
        .setTimestamp()
    );
  let rochelle1 =
    message.mentions.users.first() ||
    client.users.get(args.join(" ")) ||
    message.guild.members.find(c => c.id === args[0]);
  if (!rochelle1)
    return message.channel.sendEmbed(
      new Discord.RichEmbed()
        .addField(
          ` Bir kullanıcı etiketlemeli ve ya id girmelisin!`
        )
        .setColor("black")
        .setFooter(message.author.tag, message.author.avatarURL)
        .setTimestamp()
    );
  let user = message.mentions.users.first();
  let rochelle = message.guild.member(rochelle1);
   let isim = args[1];
  if (!isim)
    return message.channel.sendEmbed(
      new Discord.RichEmbed()
        .addField(` Geçerli bir İsim Yazmalısın!`)
        .setColor("2e0101")
        .setFooter(message.author.tag, message.author.avatarURL)
        .setTimestamp()
    );
  let yas = args[2];
  if (!yas)
    return message.channel.sendEmbed(
      new Discord.RichEmbed()
        .addField(` Geçerli bir Yaş Yazmalısın!`)
        .setColor("2e0101")
        .setFooter(message.author.tag, message.author.avatarURL)
        .setTimestamp()
    );
  rochelle.setNickname(`➺ ${isim} ' ${yas}`);
  rochelle.removeRole("763115094980558859"); 
  rochelle.addRole("763115086549352479");

  await message.channel.send(
    new Discord.RichEmbed()
      .setAuthor("Kız Kaydı Yapıldı!", message.guild.iconURL)
      .setFooter(client.user.username, client.user.avatarURL)
      .setTimestamp()
      .setThumbnail(message.mentions.users.first().avatarURL)
      .addField(
        "Kayıt Bilgileri",
        `**Kayıt Edilen Kullanıcı:**${user} \n**Yeni İsim:** \`➺ ${isim} ' ${yas}\`  \n**Kayıt Eden Yetkili:** ${message.author}`
      )
  );
  
  message.react("763293315008954398");

  const kanal2 = message.guild.channels.find(c => c.id == "763115177151168532");
  const embed2 = new Discord.RichEmbed()
    .setColor("BLACK")
    .setTimestamp()
    .setFooter("Krios ❤️ Aglaia  ")
    .setAuthor("Bilgi", message.author.avatarURL)
    .setDescription(
      `${user} aramıza hoş geldin!, <#763115165083500584> kanalından kurallarımıza göz atabilirsin.`
    );
  kanal2.send(embed2);
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["k", "woman"],
  permLevel: 0
};
exports.help = {
  name: "kız",
  description: "Belirtilen kullanıcıyı kaydeder",
  usage: ".k @etiket isim yaş",
  kategori: "yetkili"
};
