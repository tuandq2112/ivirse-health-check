import cors from "cors";
import Express from "express";
import { PORT } from "./config/env.js";
import "./job/IvirseHeathCheck.js";
const app = Express();
app.use(cors("*"));

app.listen(PORT, async () => {
  console.log("Server started!");
});
