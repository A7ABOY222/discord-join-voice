const { Client } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const http = require("http");
require("dotenv").config();

const startTime = Date.now();
let voiceConnected = false;

const client = new Client({ intents: 519 });

client.once("ready", async () => {
  console.log("Bot online!");
  client.user.setActivity("https://youtube.com/@s3notron", { type: "WATCHING" });

  const channelId = "SES KANALI ID";
  const guildId = "SUNUCU ID";
  const guild = client.guilds.cache.get(guildId);

  if (guild) {
    joinVoiceChannel({
      channelId: channelId,
      guildId: guildId,
      adapterCreator: guild.voiceAdapterCreator,
    });
    voiceConnected = true;
    console.log("Ses kanalına bağlandı!");
  } else {
    console.error("Sunucu bulunamadı, ses kanalına bağlanılamadı.");
  }
});

client.login(process.env.token);

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  if (req.url === "/status") {
    const uptimeMs = Date.now() - startTime;
    const uptimeSec = Math.floor(uptimeMs / 1000);
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;

    const status = {
      status: client.isReady() ? "online" : "offline",
      uptime: `${hours}h ${minutes}m ${seconds}s`,
      uptimeMs,
      tag: client.isReady() ? client.user.tag : null,
      voiceConnected,
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(status, null, 2));
  } else {
    res.writeHead(200);
    res.end("OK");
  }
}).listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});
