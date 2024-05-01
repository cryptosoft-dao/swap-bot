import dotenv from "dotenv";
import cors from "cors";
import express, { Express } from "express";

import TelegramBot from "node-telegram-bot-api";

dotenv.config({});

const port = 8080;
const app: Express = express();
const token = process.env.BOT_TOKEN || "";
const bot = new TelegramBot(token, { polling: true });

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

bot.on('message', (msg) => {
  if(msg.text === "/start"){
     // Customize your welcome message here
     const welcomeMessage = `🙍‍♀️ Welcome to Swap Dex-Aggregator! \nClick the button below to start.`;
     bot
       .sendMessage(msg.chat.id, welcomeMessage, {
         parse_mode: "HTML",
         reply_markup: {
           inline_keyboard: [
             [
               {
                 text: "Launch Web",
                 web_app: { url: `${process.env.WEBAPP_URL || ""}` },
               },
             ],
           ],
         },
       })
       .catch((error) => console.log(`Error sending message ${error}`));
  }
})


// Handle any errors
bot.on("polling_error", (error) => {
  console.error(error);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running on ${port}`);
});
