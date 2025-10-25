import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config";
import "dotenv/config";
let server: Server;
const PORT = 3000;
const startServer = async () => {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();
