import * as Discord from "discord.js";
import { Registry } from "./registry";
require("dotenv").config();
const bot = new Discord.Client();

//Create Instance of Registry
let registry: Registry = new Registry();
//Create function to register all commands
function registerCommands() {
  registry.setCommand("ping", __dirname + "/commands/ping.ts");
}

bot.on("ready", () => {
  console.log("-----------------------------------------------------------");
  console.log(
    `Logged in as ${bot.user.username}#${bot.user.discriminator} running version 1.0.0`
  );
  bot.user.setActivity("f!help");
  console.log(`${bot.user.username} is on ${bot.guilds.size} server(s)!`);
  console.log("-----------------------------------------------------------");
  registerCommands();
});

bot.on("message", (message: Discord.Message) => {
  const sender: Discord.User = message.author;
  //Don't respond to other bots
  if (sender.bot) return;
  // Don't respond to DM's
  if (message.channel.type === "dm") {
    return message.channel.send("Please use commands in a server!");
  }
  // Bot's Default Prefix
  const prefix: string = "f!";
  // Message Content Split By Space
  const messageArray = message.content.split(" ");
  //Get Arguments by removing the first element of the messageArray
  const args = messageArray.slice(1);
  // Get first element of messageArray, should contain the command
  const msg = messageArray[0];
  //Get rid of prefix, whitespace and line terminators
  const cmd = msg.slice(prefix.length).trim();
  //Check for prefix
  if(!msg.startsWith(prefix)) return;
  //Command Handler
  registry.getCommand(cmd, command => {
    if (command !== null) {
      command.run(bot, message, args, prefix);
    } else {
      message.channel.send(`\`${cmd} is not a command!\``);
    }
  });
});

bot.on("error", (e: any) => {
  console.error(e);
});
bot.on("warn", (e: any) => {
  console.warn(e);
});
bot.on("info", (e: any) => {
  console.info(e);
});

bot.login(process.env.BOT_TOKEN);