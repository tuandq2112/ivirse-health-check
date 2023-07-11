import nodemailer from "nodemailer";
import { APPLICATION_EMAIL, APPLICATION_PASSWORD } from "../config/env.js";
import Logger from "../utils/logger-utils.js";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: APPLICATION_EMAIL,
    pass: APPLICATION_PASSWORD,
  },
});
const listCC = ["ngohieu1811@gmail.com"];
export const sendHtmlHealthCheck = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: APPLICATION_EMAIL,
      to: to,
      subject: subject,
      html: html,
      cc: listCC,
    };
    await transporter.sendMail(mailOptions);
    Logger.info(`Send email to [${to}] successful`);
  } catch (error) {
    Logger.error(`Send email fail to ${to}: ${JSON.stringify(error)}`);
  }
};
