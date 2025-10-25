import { Server } from "http";
import app from "./app";

let server: Server;
const PORT = 3000;
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();
