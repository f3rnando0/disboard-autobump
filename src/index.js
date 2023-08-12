const { Client } = require("discord.js-selfbot-v13");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
require("dotenv").config();

const data = [
  {
    token: "",
    channels: []
  }
];

async function getBumping(token, guildArray) {
    try {
        if (token) {
            const client = new Client({
                checkUpdate: false,
              });
            await client.login(token);
            const ids = guildArray;
            for await (id of ids) {
              try {
                const guild = client.guilds.cache.get(id);
                const channel = guild.channels.cache.find(
                  (c) => c.name === process.env.BUMP_CHANNEL_NAME
                );
                await channel.sendSlash(process.env.DISBOARD_ID, "bump");
                console.log(`[BUMPED] ${client.user.id} - ${channel.name}`)
              } catch (error) {
                console.log(error);
              }
            }
            client.destroy();
            await delay(5000);
            return true;
          }
    } catch (error) {
        return error.message;
    }
}

async function main() {
    for await(const info of data) {
        try {
            await getBumping(info.token, info.channels)
        } catch (error) {
            console.log(error)
        }
    }
    
    console.log(`[INFO] Finished bumping, waiting 120 min to bump again`)
    setTimeout(main, 1000 * 60 * 121);
}

main();
