import "dotenv/config";
import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 3001;
const host = "0.0.0.0";
const app = createApp();

app.listen(port, host, () => {
  console.log(`Mandate API listening on http://${host}:${port}`);
});
