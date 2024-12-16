import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.MAILTRAP_API_TOKEN;

export const mailTrapClient = new MailtrapClient({
  token: token,
});

export const sender = {
  email: "hello@canbrs.online",
  name: "CanBRS-Alpha",
};

//recipients will be dynamically generated
