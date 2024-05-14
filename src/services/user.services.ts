const UserModel = require("../models/User");

export async function createUser(user: { chatId: number; username?:string }) {
  try {
    await UserModel.create(user);
    console.log(
      `[${new Date().toISOString()}]: New user created: ${user.chatId}`
    );
  } catch (err) {
    console.log(
      `[${new Date().toISOString()}]: Error while creating user ${user.chatId}: ${
        (err as Error).message
      }`
    );
  }
}
