import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import express, { Express } from "express";
import TelegramBot from "node-telegram-bot-api";

import { createUser } from "./services/user.services";

import { connectDB } from "./config/database";

dotenv.config({});

const port = 8080;
const app: Express = express();

const TOKEN = process.env.BOT_TOKEN || "";
const WEBURL = process.env.WEBAPP_URL || "";

const bot = new TelegramBot(TOKEN, { polling: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  switch (msg.text) {
    case "/start":
      await createUser({
        chatId: msg.chat.id,
        username: msg.chat.username || "",
      });
      // Customize your welcome message here
      const welcomeMessage = `🙍‍♀️ Welcome to Swap Dex-Aggregator! \nClick the button below to start.`;
      bot
        .sendMessage(chatId, welcomeMessage, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Launch Web",
                  web_app: { url: WEBURL },
                },
              ],
            ],
          },
        })
        .catch((error) => console.log(`Error sending message ${error}`));
      break;

    case "/setup":
      bot.sendMessage(chatId, "Please wait setting up your webapp");
      await axios
        .post(`https://api.telegram.org/bot${TOKEN}/setChatMenuButton`, {
          menu_button: {
            type: "web_app",
            text: "Swap",
            web_app: {
              url: WEBURL,
            },
          },
        })
        .then(() => {
          bot.sendMessage(
            chatId,
            `You webapp is ready to launch!\nPlease reopen or refresh the bot to see the changes`
          );
        })
        .catch(() => {
          bot.sendMessage(
            chatId,
            "Oops! Something went wrong while setting up webapp!"
          );
        });
      break;
  }
});

// Handle any errors
bot.on("polling_error", (error) => {
  console.error(error);
});

//CONNECT WITH DATABASE
connectDB(process.env.MONGO_URL || "").then(() => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running on ${port}`);
  });
});
